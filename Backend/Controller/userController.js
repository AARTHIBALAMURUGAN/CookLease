const User =require('../Models/usersModel.js')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
require('dotenv').config();


const nameRegex=/^[A-Za-z\s]+$/
const phoneRegex=/^(\+91[\-\s]?)?[6-9]\d{9}$/
const emailRegex=/^[a-zA-Z0-9._%+-]+@gmail\.com$/
const passwordRegex=/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/




const createUser=async(req,res)=>{
   try{ 

    const{name,email,phone,password}=req.body

    if(!nameRegex.test(name)){
        res.status(400).json({message:"Name Must be letters"})

    }

    if(!phoneRegex.test(phone) ){
        res.status(400).json({message:"Phone no must be in 10 digits"})
    }

    if(!emailRegex.test(email)){
        res.status(400).json({message:"Email must be in Gmail Format"})
    }


    if(!passwordRegex.test(password)){
        res.status(400).json({message:"Password must be at least 8 character,include uppercase,lowercase,number and special character"})
    }

     const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashedPassword=await bcrypt.hash(password,10)
    const user=await User.create({name,email,password:hashedPassword,phone})
    res.status(201).json({message:"user created successfully",user:user})
}
catch(e){
    res.status(500).json(e.message)
}
}


const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email or Password wrong" });
    }

    // Check if user has password (Google login users may not)
    if (!user.password) {
      return res.status(400).json({ message: "Please login with Google" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email or Password wrong" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "User logged in",
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const google=async (req, res) => {
  try {
    const token = req.cookies.token; // JWT cookie
    if (!token) return res.status(401).json({ message: "Not logged in" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password"); // hide password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
const logout=async(req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

const getUser = async (req, res) => {
  try {
    const userid = req.params.id;

    // Find user by ID
    const user = await User.findById(userid);

    // If user not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Selected User", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const user=async(req,res)=>{
 try{const user=await User.find()
 if(!user){
  return res.status(400).json({message:"No users Found"})
 }
 return res.status(200).json({message:"Users",users:user})}
 catch(e){
  return res.status(500).json({message:e.message})
 }
}





module.exports={createUser,Login,logout,getUser,user,google}