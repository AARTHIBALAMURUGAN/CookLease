import React, { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import axios from "axios";
import Navbar from "./Navbar";
import {  useNavigate } from "react-router-dom";


const Cart = () => {
  const navigate=useNavigate()
  const userId = localStorage.getItem("userId");

  const { cart, setCart, increaseQuantity, decreaseQuantity, removeFromCart } = useContext(CartContext);
  const [errors,setError]=useState({})
  const[Customername,setCustomername]=useState('')
  const [bookingDate, setBookingDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [deliveryType, setDeliveryType] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
    landmark: "",
  });

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
    if (!bookingDate || !returnDate) return alert("Select booking and return dates");
    if (deliveryType === "delivery") {
      if (!address.fullName || !address.phone || !address.street || !address.city || !address.pincode) {
        return alert("Please fill all address details for delivery");
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

      alert("Booking placed successfully!");
     navigate('/orders')
      setCustomername('')
      setCart([]);
      setShowBookingForm(false);
      setDeliveryType("");
    }   catch(e){
    if(e.response&&e.response.data&&e.response.data.message){
        const backendMessage=e.response.data.message
        setError({general:backendMessage})
    }
    else{
        setError({general:" Failed to Booking Order"})
    }
  }
  };

  return (
    <>
      <Navbar />
      <main className="cart-page container">
        <h2 className="page-title">My Cart</h2>
      

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
                    <button className="btn btn-primary proceed-btn" onClick={() => setShowBookingForm(true)}>
                      Proceed to Order
                    </button>
                  ) : (
                    <>
                      <div className="date-row">
                        <label >Customer Name</label>
                        <input  className="input" type="text" value={Customername} onChange={e=>setCustomername(e.target.value)}  required/>
                        <label>Booking</label>
                        <input className="input" type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} required />
                        <label>Return</label>
                        <input className="input" type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} required/>
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
                          <input className="input" type="text" placeholder="Full Name" value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} />
                          <input className="input" type="text" placeholder="Phone" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} />
                          <input className="input" type="text" placeholder="Street" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
                          <input className="input" type="text" placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
                          <input className="input" type="text" placeholder="Pincode" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} />
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
