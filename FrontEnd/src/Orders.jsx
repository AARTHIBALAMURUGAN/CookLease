import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const userid = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/bookings/${userid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data.Orders);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, []);

  return (
    <>
      <Navbar />
      <div className="orders-container">
        <h2 className="orders-title">📦 My Orders</h2>
        {orders.length === 0 && <p className="no-orders">You have no orders yet.</p>}

        <div className="orders-grid">
          {[...orders].reverse().map((order) => (
            <div key={order._id} className="order-card">
              
              <h4>Products:</h4>
              <ul className="product-list">
                {order.products.map((p) => (
                  <li key={p.product}>
                    {p.productName} × {p.quantity} - ₹{p.totalPrice}
                  </li>
                ))}
              </ul>

              <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
              <p><strong>Booking Date:</strong> {new Date(order.bookingDate).toLocaleDateString()}</p>
              <p><strong>Return Date:</strong> {new Date(order.returnDate).toLocaleDateString()}</p>
              <p><strong>Shipment Status:</strong> {order.shipmentStatus}</p>
              <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
              <p><strong>Address:</strong> {order.address?.fullName || "N/A"}, {order.address?.street || "N/A"}, {order.address?.city || "N/A"}</p>
            </div>
          ))}
        </div>
      </div>

    
    </>
  );
};

export default Orders;
