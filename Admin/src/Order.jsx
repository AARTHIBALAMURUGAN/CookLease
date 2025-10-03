import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./sidebar";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchorders();
  }, []);

  const fetchorders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/bookings`);
      setOrders(res.data.order || []);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to fetch Orders");
    }
  };

  const updateShipment = async (id, shipmentStatus) => {
    try {
      await axios.patch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/booking/${id}`, {
        shipmentStatus,
      });
      fetchorders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update shipment status");
    }
  };

  const updatePayment = async (id, paymentStatus) => {
    try {
      await axios.patch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/booking/${id}`, {
        paymentStatus,
      });
      fetchorders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update payment status");
    }
  };

  const updateReturnStatus = async (id, returnStatus) => {
    try {
      await axios.patch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/booking/${id}/return`, {
        returnStatus,
      });
      fetchorders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update return status");
    }
  };

  // First filter with date condition
 const filteredOrders = orders.filter((order) => {
    const nameMatch = order.customername
      .toLowerCase()
      .includes(filters.name.toLowerCase());

    const statusMatch = filters.status
      ? order.orderStatus === filters.status
      : true;

    const start = filters.startDate ? new Date(filters.startDate) : null;
    const end = filters.endDate ? new Date(filters.endDate) : null;
    const bookingDate = new Date(order.bookingDate);

    const dateMatch =
      (!start || bookingDate >= start) && (!end || bookingDate <= end);

    return nameMatch && statusMatch && dateMatch;
  });






  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="order-container">
        <h2 className="order-title">📦 Booking Orders</h2>
        {error && <p className="error">{error}</p>}

        {/* 🔍 Search Bar & Filter Button */}
        <div className="search-filter-bar">
          <input
            type="text"
            placeholder="🔍 Search by Customer Name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />

          <button
            className="filter-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters ▲" : "Show Filters ▼"}
          </button>
        </div>

        {/* 📌 Dropdown Filters */}
        {showFilters && (
          <div className="filters-panel">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="Booked">Booked</option>
              <option value="Returned">Returned</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
            />

            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
            />

            <button
              className="reset-btn"
              onClick={() =>
                setFilters({
                  name: filters.name,
                  status: "",
                  startDate: "",
                  endDate: "",
                })
              }
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* 📦 Orders Grid */}
        <div className="orders-grid">
          {filteredOrders.length > 0 ? (
            [...filteredOrders].reverse().map((order) => (
              <div key={order._id} className="order-card">
                <h3>👤 {order.customername}</h3>
                <ul className="product-list">
                  {order.products?.map((p, i) => (
                    <li key={i}>
                      {p.productName} <span>× {p.quantity}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Total:</strong> ₹{order.totalAmount}
                </p>
                <p>
                  <strong>Booking:</strong>{" "}
                  {new Date(order.bookingDate).toISOString().split('T')[0]}
                </p>
                <p>
                  <strong>Return:</strong>{" "}
                  {new Date(order.returnDate).toISOString().split('T')[0]}
                </p>

                {/* ✅ Status Section */}
                <div className="status-section">
                  <label>Delivered Status</label>
                  <select
                    value={order.shipmentStatus || ""}
                    onChange={(e) => updateShipment(order._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>

                  <label>Payment Status</label>
                  <select
                    value={order.paymentStatus || ""}
                    onChange={(e) => updatePayment(order._id, e.target.value)}
                    disabled={order.shipmentStatus !== "Delivered"}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>

                  <label>Return Status</label>
                  <select
                    value={order.returnStatus || "Not Returned"}
                    onChange={(e) => updateReturnStatus(order._id, e.target.value)}
                    disabled={order.returnStatus === "Returned"}
                  >
                    <option value="Not Returned">Not Returned</option>
                    <option value="Returned">Returned</option>
                  </select>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color:
                          order.returnStatus === "Returned" ? "green" : "red",
                      }}
                    >
                      {order.returnStatus}
                    </span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No orders found</p>
          )}
        </div>
      </div>

      {/* 🎨 Styles */}
      <style>{`
        .search-filter-bar {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 15px;
        }
        .search-filter-bar input {
          flex: 1;
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 8px;
        }
        .filter-btn {
          padding: 10px 18px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }
        .filter-btn:hover {
          background: #1d4ed8;
        }
        .filters-panel {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          background: #f9f9f9;
          padding: 15px;
          border-radius: 10px;
          border: 1px solid #ddd;
          margin-bottom: 20px;
          animation: fadeIn 0.3s ease-in-out;
        }
        .filters-panel select,
        .filters-panel input {
          padding: 8px 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }
        .reset-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 8px 14px;
          border-radius: 6px;
          cursor: pointer;
          transition: 0.2s;
        }
        .reset-btn:hover {
          background: #dc2626;
        }
        .status-section {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .status-section label {
          font-weight: 600;
          margin-top: 6px;
        }
        .status-section select {
          padding: 6px 8px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Order;
