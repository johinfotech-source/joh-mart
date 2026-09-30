import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const navigate = useNavigate();

  const {
    user,
    loading,
    logout,
  } = useAuth();

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await api.get(
          "/accounts/profile/"
        );

        setProfile(response.data);
      } catch (error) {
        console.error(error);
        setError(
          "Unable to load profile."
        );
      }
    };

    loadProfile();
  }, [user, loading, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <h2>Loading profile...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-loading">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <h2>{error}</h2>
        <Link to="/">
          ← Back to Home
        </Link>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-loading">
        <h2>Loading profile...</h2>
      </div>
    );
  }

  const displayName =
    `${profile.first_name || ""} ${
      profile.last_name || ""
    }`.trim() ||
    profile.username;

  const initial =
    displayName.charAt(0).toUpperCase();

  return (
    <div className="profile-page">

      <div className="profile-header">

        <div>
          <span className="section-label">
            JOH MART
          </span>

          <h1>👤 My Profile</h1>

          <p>
            Manage your account information.
          </p>
        </div>

        <Link
          to="/"
          className="continue-shopping"
        >
          ← Home
        </Link>

      </div>

      <div className="profile-layout">

        <section className="profile-card">

          <div className="profile-cover"></div>

          <div className="profile-main">

            <div className="profile-avatar">
              {initial}
            </div>

            <div className="profile-name-area">

              <h2>
                {displayName}
              </h2>

              <p>
                @{profile.username}
              </p>

            </div>

          </div>

          <div className="profile-details">

            <div className="profile-detail-item">
              <span>FULL NAME</span>
              <strong>
                {displayName}
              </strong>
            </div>

            <div className="profile-detail-item">
              <span>USERNAME</span>
              <strong>
                @{profile.username}
              </strong>
            </div>

            <div className="profile-detail-item">
              <span>EMAIL</span>
              <strong>
                {profile.email ||
                  "Not provided"}
              </strong>
            </div>

          </div>

        </section>

        <aside className="profile-sidebar">

          <section className="profile-quick-card">

            <span className="section-label">
              QUICK ACCESS
            </span>

            <h2>
              My Account
            </h2>

            <Link
              to="/orders"
              className="profile-link-card"
            >
              <span>📦</span>
              <div>
                <strong>My Orders</strong>
                <small>
                  View your orders
                </small>
              </div>
              <b>→</b>
            </Link>

            <Link
              to="/addresses"
              className="profile-link-card"
            >
              <span>📍</span>
              <div>
                <strong>My Addresses</strong>
                <small>
                  Manage delivery addresses
                </small>
              </div>
              <b>→</b>
            </Link>

            <Link
              to="/cart"
              className="profile-link-card"
            >
              <span>🛒</span>
              <div>
                <strong>My Cart</strong>
                <small>
                  View your cart
                </small>
              </div>
              <b>→</b>
            </Link>

          </section>

          <section className="profile-logout-card">

            <h3>
              Ready to leave?
            </h3>

            <p>
              You can safely logout from
              your JOH MART account.
            </p>

            <button
              onClick={handleLogout}
              className="profile-logout-button"
            >
              Logout
            </button>

          </section>

        </aside>

      </div>

    </div>
  );
}

export default Profile;