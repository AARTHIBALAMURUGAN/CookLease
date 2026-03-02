import React, { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import axios from "axios";
import Navbar from "./Navbar";
import {  useNavigate } from "react-router-dom";


const Cart = () => {
  const navigate=useNavigate()
  const userId = localStorage.getItem("userId");
    
  const { cart, setCart, increaseQuantity, decreaseQuantity, removeFromCart } = useContext(CartContext);
  const [errors,setErrors]=useState({})
  const[message,setmessage]=useState('')
  const[Customername,setCustomername]=useState('')
  const [bookingDate, setBookingDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [deliveryType, setDeliveryType] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [address, setAddress] = useState({
    phone: "",
    street: "",
    city: "",
    pincode: "",
    landmark: "",
  });

  const validateAddress = () => {
  let newErrors = {};

  // Full Name
  if (!Customername.trim()) {
    newErrors.customerName = "Customer Name is required";
  }

  // Phone - 10 digits only
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(address.phone)) {
    newErrors.phone = "Phone must be exactly 10 digits";
  }

  // Street
  if (!address.street.trim()) {
    newErrors.street = "Street is required";
  }

  // City
  if (!address.city.trim()) {
    newErrors.city = "City is required";
  }

  // Pincode - 6 digits only
  const pincodeRegex = /^[0-9]{6}$/;
  if (!pincodeRegex.test(address.pincode)) {
    newErrors.pincode = "Pincode must be exactly 6 digits";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const getNumberOfDays = () => {
  if (!bookingDate || !returnDate) return 1; // default 1 day if not selected
  const start = new Date(bookingDate);
  const end = new Date(returnDate);
  const diffTime = end - start;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) ; // inclusive of start & end
  return diffDays > 0 ? diffDays : 1;
};
const numberOfDays = getNumberOfDays();
const total= cart.reduce(
  (total, item) => total + item.price * item.quantity * numberOfDays,
  0
);


  const placeBooking = async () => {


     if (!userId) {
    setmessage("Please login to confirm your order.");
    
  
    return;
  }

    if (!bookingDate || !returnDate) return setmessage("Select booking and return dates");
    if (deliveryType === "delivery") {
      if (!validateAddress()) {
      return; // stop if validation fails
    }
    }

    try {
      const products = cart.map(item => ({
        product: item._id,
        productname: item.name,
        quantity: item.quantity
      }));

      await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/booking/${userId}`,
        { customername:Customername,products, bookingDate, returnDate, address: deliveryType === "delivery" ? address : {}, deliveryType, totalAmount: totalPrice },
        {withCredentials:true }
      );

      setmessage("Booking placed successfully!");
      setTimeout(()=>{
         navigate('/orders')
      },1000)
    // navigate('/orders')
      setCustomername('')
      setCart([]);
      setShowBookingForm(false);
      setDeliveryType("");
    }   catch(e){
    if(e.response&&e.response.data&&e.response.data.message){
        const backendMessage=e.response.data.message
        setErrors({general:backendMessage})
    }
    else{
        setErrors({general:" Failed to Booking Order"})
    }
  }
  };

  return (
    <>
      <Navbar />
      <main className="cart-page container">
        <h2 className="page-title">My Cart</h2>
       {message && <div className="alert alert-success">{message}</div>}

        {cart.length === 0 ? (
          <div className="empty-state">
            <p className="empty-text">Your cart is empty</p>
            <button className="btn btn-primary" onClick={() => window.location.href = "/"}>Continue Shopping</button>
          </div>
        ) : (
          <div className="cart-grid">
            <section className="cart-list">
              {cart.map(item => (
                <div key={item._id} className="cart-item">
                  <img className="cart-thumb" src={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/uploads/${item.image}`} alt={item.name} />
                  <div className="cart-info">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-price">₹{item.price} <span className="muted">/ day</span></p>
                    <div className="qty-row">
                      <button className="qty-btn" onClick={() => decreaseQuantity(item._id)} disabled={item.quantity <= 1}>−</button>
                      <span className="qty">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => increaseQuantity(item._id)} disabled={item.quantity >= item.stock}>+</button>
                      <button className="delete-btn" onClick={() => removeFromCart(item._id)}>Delete</button>
                    </div>
                    <p className="item-total">Total: ₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </section>


            <aside className="cart-summary">
                {errors.general && <div className="alert alert-danger">{errors.general}</div>}
              <div className="summary-card">
                
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>₹{totalPrice.toFixed(2)}</strong>
                </div>

                <div className="actions">
                  {!showBookingForm ? (
                    <button className="btn btn-primary proceed-btn" onClick={() => {setShowBookingForm(true);;}}>
                      Proceed to Order
                    </button>
                  ) : (
                    <>
                    {errors.customerName && <p className="error">{errors.customerName}</p>}
                      <div className="date-row">
                        <label >Customer Name</label>
                        <input  className="input" type="text" value={Customername} onChange={e=>setCustomername(e.target.value)}  required/>
                        <label>Booking</label>
                        <input className="input" type="date" value={bookingDate}  min={new Date().toISOString().split("T")[0]} onChange={e => setBookingDate(e.target.value)} required />
                        <label>Return</label>
                        <input className="input" type="date" value={returnDate}   min={new Date().toISOString().split("T")[0]}onChange={e => setReturnDate(e.target.value)} required/>
                      </div>

                      <div className="delivery-choice">
                        <h3>Delivery Type</h3>
                        <label>
                          <input type="radio" name="delivery" value="pickup" checked={deliveryType === "pickup"} onChange={() => setDeliveryType("pickup")} /> Pickup
                        </label>
                        <label>
                          <input type="radio" name="delivery" value="delivery" checked={deliveryType === "delivery"} onChange={() => setDeliveryType("delivery")} /> Home Delivery
                        </label>
                      </div>

                      {deliveryType === "delivery" && (
                        <div className="address-form">
                      
                          <input className="input" type="text" placeholder="Phone" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} />
                           {errors.phone && <p className="error">{errors.phone}</p>}
                          <input className="input" type="text" placeholder="Street" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
                           {errors.street && <p className="error">{errors.street}</p>}
                          <input className="input" type="text" placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
                           {errors.city && <p className="error">{errors.city}</p>}
                          <input className="input" type="text" placeholder="Pincode" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} />
                           {errors.pincode && <p className="error">{errors.pincode}</p>}
                          <input className="input" type="text" placeholder="Landmark (optional)" value={address.landmark} onChange={e => setAddress({...address, landmark: e.target.value})} />
                        
                        </div>
                      )}
<div className="summary-row">
  <span>Days</span>
  <strong>{numberOfDays}</strong>
</div>

                      <div className="final-row">
                        <div className="total-label">Total</div>
                        <div className="total-amount">₹{total.toFixed(2)}</div>
                      </div>

                      <button className="btn btn-success confirm-btn" onClick={placeBooking}>Confirm Order</button>
                      <button className="btn btn-secondary cancel-btn" onClick={() => setShowBookingForm(false)}>Cancel</button>
                    </>
                  )}
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </>
  );
};

export default Cart;
