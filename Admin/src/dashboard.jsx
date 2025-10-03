import React, { useEffect, useState } from "react";

import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import Sidebar from "./Sidebar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/dashboard`);
        setData(res.data);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      }
    };
    fetchDashboard();
  }, []);

  if (!data) return <p className="loading">Loading Dashboard...</p>;

  const categoryNames = data.products.map((p) => p.category);
  const categoryCounts = data.products.map((p) => p.count);
  const sizeLabels = data.products.flatMap((p) =>
    p.sizes.map((s) => `${p.category}-${s.size}`)
  );
  const sizeCounts = data.products.flatMap((p) =>
    p.sizes.map((s) => s.count)
  );

  const barData = {
    labels: categoryNames,
    datasets: [
      {
        label: "Products",
        data: categoryCounts,
        backgroundColor: "#3B82F6",
      },
    ],
  };

  const pieData = {
    labels: sizeLabels,
    datasets: [
      {
        data: sizeCounts,
        backgroundColor: [
          "#EF4444",
          "#3B82F6",
          "#F59E0B",
          "#10B981",
          "#8B5CF6",
          "#F97316",
        ],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      
      <Sidebar/>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <h1>Dashboard</h1>
          
        </header>

        {/* Summary Cards */}
        <div className="summary-grid">
          <div className="card">
            <p>Total Orders</p>
            <h2>{data.totalOrders}</h2>
          </div>
          <div className="card">
            <p>Total Users</p>
            <h2>{data.totalUsers}</h2>
          </div>
          <div className="card">
            <p>Total Products</p>
            <h2>{data.products.reduce((acc, p) => acc + p.count, 0)}</h2>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <div className="chart-card">
            <h3>Products by Category</h3>
            <Bar
              data={barData}
              options={{ responsive: true, maintainAspectRatio: false }}
              height={30}
            />
          </div>

          <div className="chart-card">
            <h3>Sizes Distribution</h3>
            <Pie
              data={pieData}
              options={{ responsive: true, maintainAspectRatio: false }}
              height={300}
            />
          </div>
        </div>

        {/* Stock Table */}
        <div className="table-card">
          <h3>Stock Details</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Size</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((p) =>
                  p.sizes.map((s) => (
                    <tr key={`${p.category}-${s.size}`}>
                      <td>{p.category}</td>
                      <td>{s.size}</td>
                      <td>{s.count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Styles */}
     
    </div>
  );
};

export default Dashboard;