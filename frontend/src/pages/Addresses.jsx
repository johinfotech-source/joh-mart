import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Addresses() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address_line: "",
    city: "",
    pincode: "",
    landmark: "",
    is_default: false,
  });

  const loadAddresses = async () => {
    try {
      const response = await api.get("/accounts/addresses/");
      setAddresses(response.data);
    } catch (error) {
      console.error(error);
      setError("Unable to load addresses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    loadAddresses();
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      await api.post(
        "/accounts/addresses/",
        form
      );

      setMessage("Address added successfully!");

      setForm({
        name: "",
        phone: "",
        address_line: "",
        city: "",
        pincode: "",
        landmark: "",
        is_default: false,
      });

      await loadAddresses();
    } catch (error) {
      console.error(error);

      const backendError = error.response?.data;

      if (backendError) {
        setError(
          Object.values(backendError)
            .flat()
            .join(" ")
        );
      } else {
        setError("Unable to save address.");
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteAddress = async (id) => {
    try {
      await api.delete(
        `/accounts/addresses/${id}/`
      );

      await loadAddresses();
      setMessage("Address deleted successfully.");
      setError("");
    } catch (error) {
      console.error(error);
      setError("Unable to delete address.");
    }
  };

  if (loading) {
    return (
      <div className="addresses-loading-page">
        <div className="addresses-loading-card">
          <div className="addresses-loading-icon">
            📍
          </div>

          <h2>Loading addresses...</h2>

          <p>
            Getting your delivery locations ready
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="addresses-page">

      {/* ================= HEADER ================= */}

      <section className="addresses-header">

        <div>

          <span className="section-label">
            JOH MART • DELIVERY
          </span>

          <h1>
            My Addresses
            <span> 📍</span>
          </h1>

          <p>
            Manage your saved delivery addresses
            for quick checkout.
          </p>

        </div>

        <Link
          to="/"
          className="continue-shopping"
        >
          <span>←</span>
          Home
        </Link>

      </section>

      {/* ================= MESSAGES ================= */}

      {message && (
        <div className="address-success">
          <span>✓</span>
          {message}
        </div>
      )}

      {error && (
        <div className="address-error">
          <span>⚠️</span>
          {error}
        </div>
      )}

      {/* ================= MAIN ================= */}

      <div className="addresses-layout">

        {/* ================= ADD ADDRESS ================= */}

        <section className="address-form-card">

          <div className="address-form-header">

            <div className="address-form-icon">
              +
            </div>

            <div>
              <span className="section-label">
                NEW ADDRESS
              </span>

              <h2>
                Add Delivery Address
              </h2>
            </div>

          </div>

          <p className="address-form-description">
            Save an address to make your JOH MART
            checkout faster.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="form-field">
              <label>Name</label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-field">
              <label>Phone</label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10 digit mobile number"
                required
              />
            </div>

            <div className="form-field">
              <label>Address</label>

              <textarea
                name="address_line"
                value={form.address_line}
                onChange={handleChange}
                placeholder="House number, street, area"
                required
              />
            </div>

            <div className="address-form-row">

              <div className="form-field">
                <label>City</label>

                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
              </div>

              <div className="form-field">
                <label>Pincode</label>

                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  required
                />
              </div>

            </div>

            <div className="form-field">
              <label>
                Landmark
                <span>Optional</span>
              </label>

              <input
                type="text"
                name="landmark"
                value={form.landmark}
                onChange={handleChange}
                placeholder="Nearby landmark"
              />
            </div>

            <label className="default-address-checkbox">

              <input
                type="checkbox"
                name="is_default"
                checked={form.is_default}
                onChange={handleChange}
              />

              <span className="custom-check"></span>

              <span className="default-address-text">
                <strong>
                  Set as default address
                </strong>

                <small>
                  Use this address automatically during checkout
                </small>
              </span>

            </label>

            <button
              type="submit"
              className="save-address-button"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="button-loader"></span>
                  Saving...
                </>
              ) : (
                <>
                  Save Address
                  <span>→</span>
                </>
              )}
            </button>

          </form>

        </section>

        {/* ================= SAVED ADDRESSES ================= */}

        <section className="saved-addresses-section">

          <div className="saved-addresses-heading">

            <div>

              <span className="section-label">
                SAVED ADDRESSES
              </span>

              <h2>
                Your Addresses
              </h2>

            </div>

            <span className="address-count">
              {addresses.length}
            </span>

          </div>

          {addresses.length === 0 ? (

            <div className="empty-addresses">

              <div className="empty-address-icon">
                📍
              </div>

              <span className="section-label">
                NO ADDRESSES YET
              </span>

              <h3>
                No saved addresses
              </h3>

              <p>
                Add your first delivery address
                using the form.
              </p>

            </div>

          ) : (

            <div className="saved-address-list">

              {addresses.map((address) => (

                <article
                  key={address.id}
                  className={
                    address.is_default
                      ? "saved-address-card default-address-card"
                      : "saved-address-card"
                  }
                >

                  <div className="saved-address-top">

                    <div className="address-person">

                      <div className="address-avatar">
                        {address.name
                          ?.charAt(0)
                          ?.toUpperCase() || "A"}
                      </div>

                      <div>
                        <h3>
                          {address.name}
                        </h3>

                        <span>
                          📞 {address.phone}
                        </span>
                      </div>

                    </div>

                    {address.is_default && (
                      <span className="default-badge">
                        ✓ Default
                      </span>
                    )}

                  </div>

                  <div className="address-content">

                    <p className="address-main">
                      {address.address_line}
                    </p>

                    <p>
                      {address.city}{" "}
                      <span>•</span>{" "}
                      {address.pincode}
                    </p>

                    {address.landmark && (
                      <p className="address-landmark">
                        📌 {address.landmark}
                      </p>
                    )}

                  </div>

                  <div className="saved-address-footer">

                    <span className="delivery-ready">
                      🚚 Delivery available
                    </span>

                    <button
                      type="button"
                      className="delete-address-button"
                      onClick={() =>
                        deleteAddress(address.id)
                      }
                    >
                      🗑 Delete
                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </div>

    </div>
  );
}

export default Addresses;