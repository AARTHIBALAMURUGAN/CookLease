const jwt=require("jsonwebtoken")
require('dotenv').config();

const authMiddleWare=(req,res,next)=>{

        const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
       return res.status(401).json({message:"Access Denied No Token Provided"})
    }

    try{
        const decode=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decode;
        next()
    }
    catch(e){
        res.status(500).json({message:e.message})
    }

}

module.exports=authMiddleWare;