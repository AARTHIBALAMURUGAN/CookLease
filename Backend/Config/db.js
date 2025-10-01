const mongoose=require('mongoose');
require('dotenv').config();

const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDb Atlas Connected")
    }
    catch(err){
        console.error("Mongoose Connection  Failed",err.message)
    }
}

module.exports=connectDb