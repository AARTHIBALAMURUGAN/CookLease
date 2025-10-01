import React, { useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './Navbar'
import { useContext } from 'react';

  import { CartContext } from './CartContext';

const ProductDetail = () => {
 const { addToCart } = useContext(CartContext);
    const{id}=useParams()
    const[product,setProduct]=useState(null)

    useEffect(()=>{
        const fetchProduct=async()=>{
            try{
             const res=await axios.get(`http://localhost:3000/api/product/${id}`)
             setProduct(res.data.product)
            }
            catch(e){
                console.log("Failed to fetch Product",e)
            }

        }
        fetchProduct();
    },[id])
if(!product) return <p>Loading......</p>

  return (
    <>
    <Navbar/>
    <div className="product-details">
      <img src={`http://localhost:3000/uploads/${product.image}`} alt={product.name} />
      <h2>{product.name}</h2>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Sizes:</strong> {product.sizes}</p>
      <p><strong>Price:</strong> ₹{product.price}</p>
      <p><strong>Stock:</strong> {product.stock > 0 ? product.stock : "Out of Stock"}</p>

      {product.stock > 0 ? (
       <button onClick={(e)=>{e.stopPropagation();
          addToCart({
  _id: product._id,
  name: product.name,
  price: product.price,
  image: product.image,
  stock: product.stock
});
}}>Add to Cart</button>
      ) : (
        <button disabled>Sold Out</button>
      )}
    </div>
    </>
  )

}

export default ProductDetail
