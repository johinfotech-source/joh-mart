import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Checkout() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const loadCheckoutData = async () => {
    try {
      const [cartResponse, addressResponse] = await Promise.all([
        api.get("/cart/"),
        api.get("/accounts/addresses/"),
      ]);

      setCart(cartResponse.data);
      setAddresses(addressResponse.data);

      const defaultAddress = addressResponse.data.find(
        (address) => address.is_default
      );

      if (defaultAddress) {
        setSelectedAddress(String(defaultAddress.id));
      } else if (addressResponse.data.length > 0) {
        setSelectedAddress(String(addressResponse.data[0].id));
      }
    } catch (error) {
      console.error(error);
      setError("Unable to load checkout details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    loadCheckoutData();
  }, [isAuthenticated, navigate]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError("Please select a delivery address.");
      return;
    }

    setPlacingOrder(true);
    setError("");

    try {
      const response = await api.post("/orders/create/", {
        address: Number(selectedAddress),
      });

      navigate(`/orders/${response.data.id}`);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.error ||
          "Unable to place order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-loading-page">
        <div className="checkout-loading-card">
          <div className="checkout-loading-icon">🛒</div>
          <span className="section-label">JOH MART</span>
          <h2>Preparing Checkout...</h2>
          <p>Getting your order ready</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="checkout-empty-page">
        <div className="checkout-empty-card">
          <div className="checkout-empty-icon">🛒</div>
          <span className="section-label">YOUR CART IS EMPTY</span>
          <h2>Nothing to checkout yet</h2>
          <p>
            Add some delicious ice cream before continuing to checkout.
          </p>

          <Link to="/products" className="checkout-shop-button">
            Browse Products
            <span>🍦</span>
            <b>→</b>
          </Link>
        </div>
      </div>
    );
  }

  const deliveryFee = 30;
  const subtotal = Number(cart.subtotal || 0);
  const total = subtotal + deliveryFee;

  return (
    <div className="checkout-page">
      <section className="checkout-header">
        <div className="checkout-header-content">
          <span className="section-label">JOH MART • SECURE CHECKOUT</span>

          <h1>
            Complete Your
            <span> Order.</span>
          </h1>

          <p>
            Just a few quick steps and your favourite ice cream will be
            on its way.
          </p>
        </div>

        <Link to="/cart" className="checkout-back-button">
          <span>←</span>
          Back to Cart
        </Link>
      </section>

      {error && (
        <div className="checkout-error-message">
          <span>⚠️</span>
          <div>
            <strong>Something needs your attention</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="checkout-layout">
        <main className="checkout-main">
          {/* ADDRESS */}
          <section className="checkout-section checkout-glass-card">
            <div className="checkout-section-heading">
              <div className="checkout-step-number">01</div>

              <div>
                <span className="section-label">DELIVERY</span>
                <h2>Delivery Address</h2>
                <p>Where should we deliver your order?</p>
              </div>
            </div>

            {addresses.length === 0 ? (
              <div className="checkout-no-address">
                <div className="checkout-no-address-icon">📍</div>

                <span className="section-label">ADDRESS REQUIRED</span>

                <h3>No delivery address yet</h3>

                <p>
                  Add a delivery address before placing your order.
                </p>

                <Link to="/addresses" className="checkout-add-address">
                  <span>+</span>
                  Add Delivery Address
                </Link>
              </div>
            ) : (
              <div className="checkout-address-list">
                {addresses.map((address) => {
                  const isSelected =
                    selectedAddress === String(address.id);

                  return (
                    <label
                      key={address.id}
                      className={
                        isSelected
                          ? "checkout-address-card selected"
                          : "checkout-address-card"
                      }
                    >
                      <input
                        type="radio"
                        name="checkout-address"
                        value={address.id}
                        checked={isSelected}
                        onChange={(event) =>
                          setSelectedAddress(event.target.value)
                        }
                      />

                      <div className="checkout-address-radio">
                        <span></span>
                      </div>

                      <div className="checkout-address-details">
                        <div className="checkout-address-title">
                          <div className="checkout-address-person">
                            <div className="checkout-address-avatar">
                              {address.name?.charAt(0)?.toUpperCase() ||
                                "A"}
                            </div>

                            <div>
                              <h3>{address.name}</h3>
                              <span>📞 {address.phone}</span>
                            </div>
                          </div>

                          {address.is_default && (
                            <span className="checkout-default-badge">
                              ✓ Default
                            </span>
                          )}
                        </div>

                        <div className="checkout-address-text">
                          <p>{address.address_line}</p>

                          <p>
                            {address.city}
                            <span> • </span>
                            {address.pincode}
                          </p>

                          {address.landmark && (
                            <p className="checkout-landmark">
                              📌 {address.landmark}
                            </p>
                          )}
                        </div>
                      </div>
                    </label>
                  );
                })}

                <Link
                  to="/addresses"
                  className="checkout-add-another"
                >
                  <span>+</span>
                  Add or manage addresses
                  <b>→</b>
                </Link>
              </div>
            )}
          </section>

          {/* ORDER ITEMS */}
          <section className="checkout-section checkout-glass-card">
            <div className="checkout-section-heading">
              <div className="checkout-step-number">02</div>

              <div>
                <span className="section-label">YOUR SELECTION</span>
                <h2>Order Items</h2>
                <p>Review everything in your order.</p>
              </div>

              <span className="checkout-item-count">
                {cart.items.length}{" "}
                {cart.items.length === 1 ? "Item" : "Items"}
              </span>
            </div>

            <div className="checkout-items-list">
              {cart.items.map((item) => (
                <div key={item.id} className="checkout-item-card">
                  <div className="checkout-item-image">
                    {item.product_image ? (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                      />
                    ) : (
                      <span>🍦</span>
                    )}
                  </div>

                  <div className="checkout-item-info">
                    <span>ICE CREAM</span>
                    <h3>{item.product_name}</h3>
                    <p>
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>

                  <div className="checkout-item-total">
                    <small>ITEM TOTAL</small>
                    <strong>₹{item.total}</strong>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PAYMENT */}
          <section className="checkout-section checkout-glass-card">
            <div className="checkout-section-heading">
              <div className="checkout-step-number">03</div>

              <div>
                <span className="section-label">PAYMENT</span>
                <h2>Payment Method</h2>
                <p>Choose how you would like to pay.</p>
              </div>
            </div>

            <div className="checkout-payment-card">
              <div className="checkout-payment-icon">💵</div>

              <div className="checkout-payment-info">
                <div>
                  <h3>Cash on Delivery</h3>
                  <span>COD</span>
                </div>

                <p>
                  Pay securely when your JOH MART order arrives.
                </p>
              </div>

              <div className="checkout-payment-selected">
                <span>✓</span>
                Selected
              </div>
            </div>
          </section>
        </main>

        {/* SUMMARY */}
        <aside className="checkout-summary-card">
          <div className="checkout-summary-glow"></div>

          <div className="checkout-summary-content">
            <span className="section-label">FINAL REVIEW</span>

            <h2>Your Order</h2>

            <div className="checkout-summary-mini">
              <span>🛒</span>
              <div>
                <strong>
                  {cart.items.length}{" "}
                  {cart.items.length === 1 ? "item" : "items"}
                </strong>
                <small>Ready for checkout</small>
              </div>
            </div>

            <div className="checkout-summary-details">
              <div className="checkout-summary-row">
                <span>Subtotal</span>
                <strong>₹{subtotal.toFixed(2)}</strong>
              </div>

              <div className="checkout-summary-row">
                <span>Delivery Fee</span>
                <strong>₹{deliveryFee.toFixed(2)}</strong>
              </div>
            </div>

            <div className="checkout-summary-divider"></div>

            <div className="checkout-grand-total">
              <div>
                <span>Grand Total</span>
                <small>Inclusive of delivery</small>
              </div>

              <strong>₹{total.toFixed(2)}</strong>
            </div>

            <button
              className="checkout-place-order"
              onClick={handlePlaceOrder}
              disabled={
                placingOrder ||
                addresses.length === 0 ||
                !selectedAddress
              }
            >
              {placingOrder ? (
                <>
                  <span className="checkout-button-loader"></span>
                  Placing Order...
                </>
              ) : (
                <>
                  Place Order
                  <span>→</span>
                </>
              )}
            </button>

            <div className="checkout-security-box">
              <div>
                <span>🔒</span>
                <div>
                  <strong>Secure Checkout</strong>
                  <small>Your order details are protected</small>
                </div>
              </div>

              <div>
                <span>💵</span>
                <div>
                  <strong>Cash on Delivery</strong>
                  <small>Pay when your order arrives</small>
                </div>
              </div>
            </div>

            <Link to="/cart" className="checkout-edit-cart">
              ← Edit Cart
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;
