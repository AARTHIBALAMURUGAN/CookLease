import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";


const Profile = () => {
  
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return; // Don't fetch if not logged in

    const fetchUserData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
        setError("Failed to load user data");
      }
    };

    fetchUserData();
  }, [userId, token]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
  };

  if (!userId) {
    return (
      <>
      <Navbar/>
      <div className="not-logged-in">
        <h2>⚠ You are not logged in</h2>
        <p>Please login if you have an account or signup if you don't.</p>
        <div className="auth-buttons">
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>
          <Link to="/sign-up">
            <button className="signup-btn">Sign Up</button>
          </Link>
        </div>
      
        <style>{`
          .not-logged-in {
            text-align: center;
            padding: 80px 20px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          .not-logged-in h2 {
            font-size: 24px;
            color: #ef4444;
            margin-bottom: 20px;
          }
          .not-logged-in p {
            font-size: 16px;
            margin-bottom: 30px;
            color: #374151;
          }
          .auth-buttons button {
            margin: 0 10px;
            padding: 12px 20px;
            font-size: 15px;
            font-weight: 600;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: 0.2s ease;
          }
          .login-btn {
            background-color: #2563eb;
            color: #fff;
          }
          .login-btn:hover {
            background-color: #1d4ed8;
          }
          .signup-btn {
            background-color: #10b981;
            color: #fff;
          }
          .signup-btn:hover {
            background-color: #059669;
          }
        `}</style>
      </div>
      </>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="profile-page">
      <div className="profile-card">
        <h2>👤 My Profile</h2>
        {error && <p className="error">{error}</p>}
        <p>
          <strong>Name:</strong> {user?.name || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {user?.email || "N/A"}
        </p>
        <p>
          <strong>Phone:</strong> {user?.phone || "N/A"}
        </p>
        <button className="logout-btn" onClick={logout}>
          Log Out
        </button>
      </div>
      <style>{`
        .profile-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          background-color: #f3f4f6;
          padding: 20px;
        }
        .profile-card {
          background: #fff;
          padding: 30px 40px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          max-width: 400px;
          width: 100%;
          text-align: center;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .profile-card h2 {
          font-size: 22px;
          color: #2563eb;
          margin-bottom: 20px;
        }
        .profile-card p {
          font-size: 16px;
          color: #374151;
          margin-bottom: 12px;
        }
        .profile-card strong {
          font-weight: 600;
        }
        .logout-btn {
          margin-top: 20px;
          padding: 12px 20px;
          background-color: #ef4444;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .logout-btn:hover {
          background-color: #dc2626;
        }
        .error {
          color: red;
          margin-bottom: 15px;
        }
      `}</style>
    </div>
    </>
  );
};

export default Profile;
