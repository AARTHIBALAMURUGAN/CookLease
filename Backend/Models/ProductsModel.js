const mongoose=require('mongoose')

const productSchema=mongoose.Schema({

    name:{
        type:String,required:true
    },
   category:{
    type:String,required:true
   },
   image:{type:String,required:true},

    sizes:{
        type:String,
        required:true
    }
    ,
    description:{
        type:String,
        required:true

    },
    price:{
        type:Number,
        required:true

    },
    stock:{type:Number,required:true,default:0}

},{timestamps:true})

const Taxa=mongoose.model('Products',productSchema)

module.exports=Taxa