import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import { useContext } from "react";
import { CartContext } from "./CartContext";
const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
const { clearCart } = useContext(CartContext);
const [message,setmessage]=useState("")
  // Fetch user info from backend (works for both Google and normal login)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/google`,
          { withCredentials: true } // send cookie
        );
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
        setError("Failed to load user data");
      }
    };

    fetchUserData();
  }, []);

  // Logout function
  const logout = async () => {
      const confirmLogout = window.confirm("Are you sure you want to logout?");
  if (!confirmLogout) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/logout`,
        {},
        
        { withCredentials: true }
      );
      clearCart();
        localStorage.removeItem("userId");
      setUser(null);
        setmessage("Successfully logged out!");
        setTimeout(()=>{
          navigate("/");
        },1000)
     
    } catch (err) {
      console.error("Logout failed:", err);
      
    setmessage("Logout failed. Please try again.");
    }
  };

  // If not logged in
  if (!user) {
    return (
      <>
        <Navbar />
        <div className="not-logged-in">
            {message && <div className="alert alert-success">{message}</div>}
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

         
        </div>
      </>
    );
  }

  // If logged in, show profile
  return (
    <>
      <Navbar />
        {message && <div className="alert alert-success">{message}</div>}
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
{user?.phone && (
  <p>
    <strong>Phone:</strong> {user.phone}
  </p>
)}

          <button className="logout-btn" onClick={logout}>
            Log Out
          </button>
        </div>

        
      </div>
    </>
  );
};

export default Profile;
