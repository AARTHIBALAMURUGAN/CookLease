import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

const User = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/user`);
        setUsers(res.data.users);
      } catch (e) {
        if (e.response?.data?.message) {
          setError(e.response.data.message);
        } else {
          setError("Failed to fetch users");
        }
      }
    };
    getUser();
  }, []);

  return (
    <div style={{display:'flex'}}>
      <Sidebar/>
    <div className="user-container">
      <h2 className="user-title">👥 Users</h2>
      {error && <p className="error">{error}</p>}

      <div className="users-grid">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user._id} className="user-card">
              <h3>{user.name}</h3>
              {user.phone &&<p><strong>Phone:</strong> {user.phone}</p>}
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>
      </div>

    </div>
  );
};

export default User;
