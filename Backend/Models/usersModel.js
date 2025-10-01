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
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
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