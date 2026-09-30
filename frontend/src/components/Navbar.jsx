import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  return (
    <nav className="navbar">

      <div className="navbar-container">

        <Link
          to="/"
          className="navbar-brand"
          onClick={closeMenu}
        >
          🍦 JOH MART
        </Link>

        <button
          className="mobile-menu-button"
          onClick={() =>
            setMenuOpen((current) => !current)
          }
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <div
          className={
            menuOpen
              ? "navbar-links mobile-open"
              : "navbar-links"
          }
        >

          <Link
            to="/"
            onClick={closeMenu}
          >
            Home
          </Link>

          <Link
            to="/products"
            onClick={closeMenu}
          >
            Products
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/cart"
                onClick={closeMenu}
              >
                🛒 Cart
              </Link>

              <Link
                to="/orders"
                onClick={closeMenu}
              >
                📦 Orders
              </Link>

              <Link
                to="/addresses"
                onClick={closeMenu}
              >
                📍 Addresses
              </Link>

              <Link
                to="/profile"
                onClick={closeMenu}
              >
                👤 Profile
              </Link>

              <button
                className="navbar-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={closeMenu}
              >
                Register
              </Link>
            </>
          )}

        </div>

        {isAuthenticated && user && (
          <div className="navbar-user">
            Hello,{" "}
            {user.first_name ||
              user.username}
          </div>
        )}

      </div>

    </nav>
  );
}

export default Navbar;