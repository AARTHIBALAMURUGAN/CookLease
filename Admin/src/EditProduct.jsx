import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./sidebar";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [sizes, setSizes] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/product/${id}`);
        const p = res.data.product;
        setName(p.name);
        setCategory(p.category);
        setSizes(p.sizes);
        setDescription(p.description);
        setPrice(p.price);
        setStock(p.stock);
      } catch (e) {
        console.error("Failed to load product", e.message);
      }
    };
    fetchProduct();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("sizes", sizes);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      if (image) formData.append("image", image);

      await axios.patch(`http://localhost:3000/api/product/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product updated successfully");
      navigate("/"); 
    } catch (e) {
      console.error(e.message);
      alert("Failed to update product");
    }
  };

  return (
  <div style={{display:'flex'}}>
    <Sidebar/>
    <div className="edit-form-container">
      
      <h2 className="title">✏️ Edit Product</h2>
      <form className="edit-form" onSubmit={handleUpdate}>
        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Category</label>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />

        <label>Image</label>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <label>Sizes</label>
        <input type="text" value={sizes} onChange={(e) => setSizes(e.target.value)} />

        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" />

        <label>Price (₹)</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />

        <label>Stock</label>
        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />

        <button type="submit" className="btn-update">Update Product</button>
      </form>
      </div>

    
    </div>
  );
};

export default EditProduct;
