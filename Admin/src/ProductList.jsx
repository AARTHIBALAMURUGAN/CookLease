import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/products');
        setProducts(res.data.item);
        setLoading(false);
      } catch (e) {
        console.error(e.message);
        setError('Failed to fetch products');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/api/product/delete/${id}`);
      setProducts(products.filter((item) => item._id !== id));
      alert('Product deleted successfully');
    } catch (e) {
      console.error(e.message);
      alert('Failed to delete product');
    }
  };

  if (loading) return <p className="loading">Loading products...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
   
    <div className="product-list-container" style={{ display: 'flex' }}>
       <Sidebar/>
       <div>
      <div className="header-bar">
        <h2 className="title">Product Management</h2>
        <button className="btn add" onClick={() => navigate('/product')}>+ Add Product</button>
      </div>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Image</th>
                <th>Size</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>
                    {item.image ? (
                      <img
                        src={`http://localhost:3000/uploads/${item.image}`}
                        alt={item.name}
                        className="product-img"
                      />
                    ) : (
                      'No Image'
                    )}
                  </td>
                  <td>{item.sizes}</td>
                  <td className="desc">{item.description}</td>
                  <td>₹{item.price}</td>
                  <td>{item.stock}</td>
                  <td className="actions">
                    <button className="btn update" onClick={() => navigate(`/edit/${item._id}`)}>Update</button>
                    <button className="btn delete" onClick={() => handleDelete(item._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      )}

     </div>
    </div>
    </>
  );
};

export default ProductList;