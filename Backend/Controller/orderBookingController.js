const Product=require('../Models/ProductsModel')
const Order=require('../Models/orderbookingModel')


const createBooking=async(req,res)=>{

  try{
      const userid=req.params.id
    const{customername, products,bookingDate,returnDate,address,deliveryType}=req.body

    if(!products || !bookingDate ||!returnDate ||!deliveryType ){
        return res.status(400).json({message:"All fileds are required"})
    }

     

    const startDay=new Date(bookingDate)
    const endDay=new Date(returnDate)
    const rentaldays=Math.ceil((endDay-startDay)/(1000*60*60*24))


    if(rentaldays<=0){
        return res.status(400).json({message:"Return date must be after booking Date"})
    }

    if (deliveryType === "delivery") {
      const { fullName, phone, street, city, pincode } = address || {};
      if (!fullName || !phone || !street || !city || !pincode) {
        return res.status(400).json({ message: "Complete address details required" });
      }
    }


    let totalAmount=0
    let productList=[]

    for(const item of products){
        const productId = item.product.trim();
        const productname=item.productname
            const quantity = item.quantity;
        const productData=await Product.findById(productId);

        if(!productData){
            return res.status(404).json({message:`Product ${productId} not found`})
        }


          // ✅ check stock
  if (productData.stock < quantity) {
    return res.status(400).json({ message: `Not enough stock for ${productData.name}` });
  }

  // ✅ reduce stock
  productData.stock -= quantity;
  await productData.save();

        const totalPrice=productData.price*rentaldays*item.quantity

        productList.push({product:productId,
            productName:productname,
            quantity :quantity,
            pricePerday:productData.price,
            totalPrice:totalPrice
        })

        totalAmount+=totalPrice
    }

    const booking=await Order.create({customer:userid,
        customername:customername,
        products:productList,
        bookingDate:startDay,
        returnDate:endDay,
        totalAmount,
           deliveryType: deliveryType || "pickup",
       address: deliveryType === "delivery" ? address : {},
        paymentstatus:"Pending",
        orderStatus:"Booked",
})

    res.status(201).json({message:"Booking Created Successfully",Booking:booking})
  }
   catch(e){
        res.status(500).json({message:e.message})
    }

}

// const updateAddress=async(req,res)=>{

//     try{
//         const orderId=req.params.id
//         const {address}=req.body
//  if (!address) {
//             return res.status(400).json({ message: "Address is required" });
//         }

       
        
//         const updateaddress=await Order.findByIdAndUpdate(
//             orderId

//         )

//          if (!updateaddress) {
//             return res.status(404).json({ message: "Order not found" });
//         }

//         if (updateaddress.shipmentStatus === "Shipped" || updateaddress.shipmentStatus === "Delivered") {
//             return res.status(400).json({ message: "Address cannot be changed after shipment" });
//         }
// updateaddress.address = address;
//         await updateaddress.save();
//         res.status(200).json({ message: "Address updated successfully", order: updateaddress });


//     }
//     catch (e) {
//         res.status(500).json({ message: e.message });
//     }
// }

const getOrder=async(req,res)=>{
    try{
        const id=req.params.id
        const getorder=await Order.find({customer:id})
        if(!getOrder){
            return res.status(404).json({message:"Selected user order not found "})
        }
        return res.status(200).json({message:"All order fetched successfully",Orders:getorder})
    }
    catch(e){
        res.status(500).json({message:e.message})
    }
}

const order=async(req,res)=>{
    try{

        const bookings=await Order.find()
        if(!bookings){
            return res.status(404).json({message:"No Booking "})
        }
        return res.status(200).json({message:"Bookings",order:bookings})
    }
    catch(e){
     res.status(500).json({message:e.message})
    }
}

// Update order shipment & payment status
const update = async (req, res) => {
  try {
    const { shipmentStatus, paymentStatus } = req.body;
    const { id } = req.params;

    const updateFields = {};
    if (shipmentStatus) updateFields.shipmentStatus = shipmentStatus;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: false } // disable full validation on partial updates
    );

    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const returned = async (req, res) => {
  try {
    const booking = await Order.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.returnStatus === "Returned") {
      return res.status(400).json({ message: "Already returned" });
    }

    // ✅ stock restore
    for (const p of booking.products) {
      await Product.findByIdAndUpdate(p.product, { $inc: { stock: p.quantity } });
    }

    booking.returnStatus = "Returned";
    booking.orderStatus = "Returned";
    await booking.save();

    res.json({ message: "Return status updated & stock restored", booking });
  } catch (error) {
    console.error("Error updating return status:", error);
    res.status(500).json({ message: "Server error" });
  }
};






module.exports={createBooking,getOrder,order,update,returned}