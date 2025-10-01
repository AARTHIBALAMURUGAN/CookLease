import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <ul>
        <h2>CookLease</h2>
        <div className="nav-links">
          <li><Link to="/">Product</Link></li>
          <li><Link to="/orders">Orders</Link></li>
          <li><Link to="/cart">Cart</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </div>
      </ul>
    </nav>
  );
}