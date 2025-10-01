import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button - shows only on mobile */}
      <button className="hamburger-btn" onClick={() => setIsOpen(true)}>
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}

      {/* Sidebar - your exact same styling with mobile toggle */}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <h2 className="sidebar-title">Admin Panel</h2>
        
        {/* Close Button (X) inside sidebar */}
        <button className="sidebar-close" onClick={() => setIsOpen(false)}>
          ×
        </button>
        
        <nav className="sidebar-nav">
          <Link to='/' onClick={() => setIsOpen(false)}>Dashboard</Link>
          <Link to='/products' onClick={() => setIsOpen(false)}>Product</Link>
          <Link to='/orders' onClick={() => setIsOpen(false)}>Orders</Link>
          <Link to='/users' onClick={() => setIsOpen(false)}>Users</Link>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;