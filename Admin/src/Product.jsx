import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';

const Product = () => {
  const [Name, setName] = useState('');
  const [Category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [sizes, setSizes] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  const createProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', Name);
      formData.append('category', Category);
      formData.append('image', image);
      formData.append('sizes', sizes);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('stock', stock);

      await axios.post('http://localhost:3000/api/product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('✅ Product created successfully');
      setName('');
      setCategory('');
      setImage(null);
      setSizes('');
      setDescription('');
      setPrice('');
      setStock('');
    } catch (e) {
      if (e.response?.data?.message) {
        alert(e.response.data.message);
      } else {
        alert('❌ Failed to create product');
      }
    }
  };

  return (
    <div className="product-form-container" style={{ display: 'flex' }}>
      <Sidebar/>
      <div className="product">
      <h2 className="title">➕ Add New Product</h2>
      <form className="product-form" onSubmit={createProduct}>
        <label>Product Name</label>
        <input type="text" value={Name} onChange={(e) => setName(e.target.value)} required />

        <label>Product Category</label>
        <input type="text" value={Category} onChange={(e) => setCategory(e.target.value)} required />

        <label>Product Image</label>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <label>Product Size</label>
        <input type="text" value={sizes} onChange={(e) => setSizes(e.target.value)} />

        <label>Product Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" />

        <label>Product Price (₹)</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />

        <label>Product Stock</label>
        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />

        <button type="submit" className="btn-submit">Save Product</button>
      </form>
</div>
      
    </div>
  );
};

export default Product;
