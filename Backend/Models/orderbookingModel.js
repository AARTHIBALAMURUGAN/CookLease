const mongoose=require('mongoose')
const orderSchema=mongoose.Schema({
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    customername:{
        type:String,
        required:true
    },
    products:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Products",
                required:true
            },
            productName:{
                type:String,
                required:true
            },
            quantity:{
                type:Number,
                required:true,
                min:1
            },
            pricePerday:{
                type:Number,
                required:true
            },
            totalPrice:{
                type:Number,
                required:true
            }  
            
        }
    ],
    bookingDate:{
        type:Date,
        required:true
    },
    returnDate:{
    type:Date,
    required:true
},
totalAmount:{
    type:Number,
    required:true
},
deliveryType:{
    type:String,
    enum: ["pickup", "delivery"],
    required:true
}
,
 address: {
        fullName: { type: String },
        phone: { type: String},
        street: { type: String },
        city: { type: String },
        pincode: { type: String },
        landmark: { type: String }
    },
paymentStatus:{
    type:String,
    enum:["Pending","Paid","Failed"],
    default:"Pending"
},

orderStatus:{
    type:String,
    enum:["Booked","Returned","Cancelled"],
    default:"Booked"
},
   shipmentStatus: {
        type: String,
        enum: ["Pending", "Shipped", "Delivered"],
        default: "Pending"
    },
     returnStatus: {
    type: String,
    enum: ["Not Returned", "Returned"],
    default: "Not Returned",
  },
},{timestamps:true})

const orderBooking=mongoose.model('OrderBooking',orderSchema)
module.exports=orderBooking