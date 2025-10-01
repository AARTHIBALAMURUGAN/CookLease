const mongoose=require('mongoose')
const Product=require('../Models/ProductsModel.js')
const SizeRegex=/^[A-Za-z0-9\s]+$/
const Priceregex=/^\d+$/
const nameRegex=/^[A-Za-z\s]+$/
const createProducts=async(req,res)=>{

    try{
        const{name,description,price,category,sizes,stock}=req.body
          const image = req.file ? req.file.filename : null; // store unique filename
if (!name || !category || !price ||!description||!sizes || !stock) {
    return res.status(400).json({ message: "Name, category, and price are required" });
}
    if(!SizeRegex.test(sizes)){
        res.status(400).json({message:"Size only have  numbers and letters"})
    }

    if(!nameRegex.test(name)){
        res.status(400).json({message:"Name must be in letters only"})
    }
    

    if(!Priceregex.test(price.toString())){
        res.status(400).json({message:"Price must be in numbers only"})
    }

    const createItem=await Product.create({name,description,price,category,image,sizes,stock})
    return res.status(201).json({message:"Products Added Successfully",Item:createItem})
}
catch(e){
    res.status(500).json({message:e.message})
}
    

}

const ListProducts=async(req,res)=>{
   try{ const List=await Product.find()
    res.status(200).json({message:"All Products fetched successfully",item:List})
}
catch(e){
    res.status(500).json({message:e.message})
}
}

const productDetail=async(req,res)=>{
  try{
   const id=req.params.id
     // Check if id is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const product=await Product.findById(id)
    if(!product){
      return  res.status(404).json("Product not found")
    }
  return  res.status(200).json({message:"Selected Product",product:product})
  }
  catch(e){
   return res.status(500).json({message:e.message})
  }
}

const productdelete=async(req,res)=>{
  try{

    const id=req.params.id
    const productdelete=await Product.findByIdAndDelete(id)
    if(!productdelete){
      return res.status(200).json({message:"Product Not Found"})
    }
    return res.status(200).json({message:"Selected Product Deleted SuccessFully",product:productdelete})

  }
  catch(e){
   return res.status(500).json({message:e.message})
  }
}

// Update product by ID
const updateProduct = async (req, res) => {


  try {
    const id=req.params.id
    const { name, description, price, category, sizes, stock } = req.body;
    const image = req.file ? req.file.filename : null;

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.sizes = sizes || product.sizes;
    product.stock = stock || product.stock;
    if (image) product.image = image;

    const updatedProduct = await product.save();

    res.status(200).json({ message: "Product updated successfully", item: updatedProduct });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

;


module.exports={createProducts,ListProducts,productDetail,productdelete,updateProduct}