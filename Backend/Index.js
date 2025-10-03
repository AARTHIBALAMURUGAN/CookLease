const express=require("express")
const cors=require("cors")
const connectDb =require('./Config/db.js')
const router=require('./Routes/routes.js')
require('dotenv').config();
const path = require('path');

connectDb()
const app=express();


const port= process.env.PORT || 5000;
const allowedOrigins = [
  process.env.CORS_ORIGIN_ADMIN,
  process.env.CORS_ORIGIN_USER
];

app.use(
  cors({
    origin: allowedOrigins,  // React dev server URL
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true
  })
);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.use("/api",router)



app.get('/',(req,res)=>{
    res.send("Hello")

})

app.listen(port,()=>{
    console.log("Server Connected")
})