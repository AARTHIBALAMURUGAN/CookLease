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


const Login=async(req,res)=>{
try{
    const {email,password}=req.body
        const userEmail=await User.findOne({email:email})
    const userpw=await bcrypt.compare(password,userEmail.password)

if(!email && !userpw){
    return res.status(400).json({message:"Email or Password wrong"})
}

const tokens=jwt.sign({email},process.env.JWT_SECRET)
 return res.status(200).json({message:"user Logges in",tokens,user:{
    _id:userEmail._id,
    email:userEmail.email
}})
}

catch(e){
res.status(500).json({message:e.message})
}


}

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





module.exports={createUser,Login,getUser,user}