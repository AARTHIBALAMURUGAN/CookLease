import React, { useState,useEffect } from 'react'
import axios from 'axios'
import Product from './Product'
import Navbar from './Navbar'
const Products = () => {
const[product,setproduct]=useState([])
const[loading,setloading]=useState(true);
const[error,seterror]=useState('')
  const [categoryFilter, setCategoryFilter] = useState('');


    useEffect(()=>{
        const fetchProducts=async()=>{
        try{const res=await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/products`)

setproduct(res.data.item)

setloading(false)

}
catch(e){
    console.log(e.message)
    seterror("failed to fetch products")
    setloading(false)
}}
fetchProducts();
    },[])

     const filteredProducts = categoryFilter
    ? product.filter(p =>
        p.category.toLowerCase().includes(categoryFilter.toLowerCase())
      )
    : product;

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;
   

  return (
    <>
    <Navbar/>
    <div className="search-bar">
 <input
 
          type="text"
          placeholder="Search by category..."
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        />
        <button onClick={() => setCategoryFilter('')}>Clear</button>
      </div>
   <div className="products-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <Product
              key={item._id}
              _id={item._id}
              name={item.name}
              category={item.category}
              image={item.image}
              sizes={item.sizes}
              description={item.description}
              price={item.price}
              stock={item.stock}
            />
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>

   
    </>
  )
}

export default Products
