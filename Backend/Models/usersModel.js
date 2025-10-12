const mongoose=require('mongoose')
const UserSchema=mongoose.Schema({
    status:{
        type:Number,
        default:1
    },
    name:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
       
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // allow null values for normal users
    },
    cartdata: {
      type: Object,
      default: {},
    },
},{
    timestamps:true
})

const User=mongoose.model('user',UserSchema)
module.exports=User