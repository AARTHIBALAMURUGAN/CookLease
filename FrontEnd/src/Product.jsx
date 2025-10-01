
import Navbar from './Navbar';
import { useContext,useState } from 'react';
import { useNavigate } from 'react-router-dom';
  import { CartContext } from './CartContext';
const Product =({ _id, name, category, image, sizes, description, price, stock }) => {
  const {cart, addToCart } = useContext(CartContext);
const navigate=useNavigate()
  const [added, setAdded] = useState(false);
    const isInCart = cart.some(item => item._id === _id);
const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({ _id, name, price, image, stock });
    setAdded(true);

    // Optional: reset added status after 2 seconds
    setTimeout(() => setAdded(false), 2000);
  };
    return (
      <>
    <div className="card" style={{cursor:"pointer"}}>
      <div  onClick={()=>navigate(`/product/${_id}`)}>
        
      <img src={`http://localhost:3000/uploads/${image}`} alt={name} />

      <h3>{name}</h3>
      <h4><strong>Category:</strong>{category}</h4>
      <p><strong>Size:</strong> {sizes}</p>
      <p>{description}</p>
      <p className="price">Price: ₹{price}</p>
    
      <br/>
      {stock > 0 ? (
        // Add to Cart click → only adds to cart
        <button onClick={handleAddToCart} disabled={isInCart || added}>
            {isInCart || added ? "Added to Cart" : "Add to Cart"}
          </button>
      ) : (
        <button disabled>Out Of Stock</button>
      )}
    </div>
    </div>
    </>
  );
}

export default Product
