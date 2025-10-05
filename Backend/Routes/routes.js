const express=require("express")
const router=express.Router()
const multer = require('multer');
const path = require("path");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in uploads folder
    },filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});
const upload = multer({storage});
const {createUser,Login, getUser, user, }=require('../Controller/userController.js')
const {createProducts,  ListProducts, productDetail, productdelete,updateProduct} = require("../Controller/productController.js")
const authMiddleWare=require('../Middleware/authMiddleware.js');
const {createBooking,getOrder, order, update, returned} = require("../Controller/orderBookingController.js");
const { getDashboardData } = require("../Controller/dashboardController.js");
router.post('/register',createUser)

router.post('/login',Login)


router.get('/user/:id',authMiddleWare,getUser)

router.get('/user',user)

router.post('/product', upload.single('image'),createProducts)

router.get('/products',ListProducts)

router.get('/product/:id',productDetail)

router.patch("/product/update/:id", upload.single("image"), updateProduct); 

router.delete('/product/delete/:id',productdelete)

router.post('/booking/:id',authMiddleWare,createBooking)

router.get('/bookings/:id',authMiddleWare,getOrder)

router.get('/bookings',order)

router.patch('/booking/:id',update)



// ✅ after function declaration
router.patch("/booking/:id/return", returned);

router.get('/dashboard',getDashboardData)
// router.patch('/address/:id',authMiddleWare,updateAddress)
module.exports=router;