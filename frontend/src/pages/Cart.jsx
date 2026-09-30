import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCart = async () => {
    try {
      const response = await api.get("/cart/");
      setCart(response.data);
    } catch (error) {
      console.error(error);
      setError("Unable to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    loadCart();
  }, [isAuthenticated, navigate]);

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;

    try {
      const response = await api.patch(
        `/cart/items/${itemId}/`,
        { quantity }
      );

      setCart(response.data);
      setError("");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.error ||
          "Unable to update quantity."
      );
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await api.delete(
        `/cart/items/${itemId}/remove/`
      );

      setCart(response.data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Unable to remove item.");
    }
  };

  const clearCart = async () => {
    try {
      const response = await api.delete("/cart/clear/");

      setCart(response.data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Unable to clear cart.");
    }
  };

  if (loading) {
    return (
      <div className="cart-loading-page">
        <div className="cart-loading-card">
          <div className="cart-loading-icon">🛒</div>
          <h2>Loading your cart...</h2>
          <p>Checking your delicious picks</p>
        </div>
      </div>
    );
  }

  if (error && !cart) {
    return (
      <div className="cart-error-page">
        <div className="cart-error-card">
          <div>⚠️</div>
          <h2>{error}</h2>

          <Link to="/products">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = Number(cart?.subtotal || 0);
  const deliveryFee = items.length > 0 ? 30 : 0;
  const grandTotal = subtotal + deliveryFee;

  return (
    <div className="cart-page">

      {/* ================= HEADER ================= */}

      <section className="cart-header">

        <div>

          <span className="section-label">
            JOH MART • YOUR BAG
          </span>

          <h1>
            Your Cart
            <span> 🛒</span>
          </h1>

          <p>
            Review your favourite ice creams before
            placing your order.
          </p>

        </div>

        <Link
          to="/products"
          className="continue-shopping"
        >
          <span>←</span>
          Continue Shopping
        </Link>

      </section>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="cart-error-message">
          <span>⚠️</span>
          {error}
        </div>
      )}

      {/* ================= EMPTY CART ================= */}

      {items.length === 0 ? (

        <section className="empty-cart">

          <div className="empty-cart-glow"></div>

          <div className="empty-cart-icon">
            🛒
          </div>

          <span className="section-label">
            YOUR CART IS WAITING
          </span>

          <h2>
            Nothing delicious here yet
          </h2>

          <p>
            Explore our collection and add your
            favourite ice cream to the cart.
          </p>

          <Link
            to="/products"
            className="shop-now-button"
          >
            Browse Ice Cream
            <span>🍦</span>
            <b>→</b>
          </Link>

        </section>

      ) : (

        <div className="cart-layout">

          {/* ================= CART ITEMS ================= */}

          <section className="cart-items-section">

            <div className="cart-items-header">

              <div>
                <span className="section-label">
                  YOUR SELECTION
                </span>

                <h2>
                  Cart Items
                  <span> ({items.length})</span>
                </h2>
              </div>

              <button
                type="button"
                className="clear-cart-button"
                onClick={clearCart}
              >
                🗑 Clear Cart
              </button>

            </div>

            <div className="cart-items-list">

              {items.map((item) => (

                <article
                  key={item.id}
                  className="cart-item-card"
                >

                  {/* Product Image */}

                  <div className="cart-item-image">

                    {item.product_image ? (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                      />
                    ) : (
                      <span>🍦</span>
                    )}

                  </div>

                  {/* Product Info */}

                  <div className="cart-item-info">

                    <span className="cart-item-label">
                      ICE CREAM
                    </span>

                    <h3>
                      {item.product_name}
                    </h3>

                    <p className="cart-item-price">
                      ₹{item.price}
                      <span> / item</span>
                    </p>

                    <div className="cart-item-actions">

                      <div className="cart-quantity">

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <strong>
                          {item.quantity}
                        </strong>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1
                            )
                          }
                          aria-label="Increase quantity"
                        >
                          +
                        </button>

                      </div>

                      <button
                        type="button"
                        className="remove-item-button"
                        onClick={() =>
                          removeItem(item.id)
                        }
                      >
                        Remove
                      </button>

                    </div>

                  </div>

                  {/* Item Total */}

                  <div className="cart-item-total">

                    <span>ITEM TOTAL</span>

                    <strong>
                      ₹{item.total}
                    </strong>

                  </div>

                </article>

              ))}

            </div>

          </section>

          {/* ================= SUMMARY ================= */}

          <aside className="cart-summary">

            <div className="summary-top">

              <span className="section-label">
                ORDER SUMMARY
              </span>

              <h2>
                Almost there ✨
              </h2>

              <p>
                Your sweet order is ready for checkout.
              </p>

            </div>

            <div className="summary-details">

              <div className="summary-row">
                <span>Items</span>
                <strong>{items.length}</strong>
              </div>

              <div className="summary-row">
                <span>Subtotal</span>
                <strong>
                  ₹{subtotal.toFixed(2)}
                </strong>
              </div>

              <div className="summary-row">
                <span>
                  Delivery
                </span>

                <strong>
                  ₹{deliveryFee.toFixed(2)}
                </strong>
              </div>

            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">

              <div>
                <span>Grand Total</span>
                <small>Inclusive of delivery</small>
              </div>

              <strong>
                ₹{grandTotal.toFixed(2)}
              </strong>

            </div>

            <Link
              to="/checkout"
              className="checkout-button"
            >
              Proceed to Checkout
              <span>→</span>
            </Link>

            <div className="cart-trust">

              <div className="cart-trust-item">
                <span>💵</span>
                <div>
                  <strong>COD Available</strong>
                  <small>Pay when delivered</small>
                </div>
              </div>

              <div className="cart-trust-item">
                <span>🍨</span>
                <div>
                  <strong>Fresh & Delicious</strong>
                  <small>Made for your moments</small>
                </div>
              </div>

            </div>

          </aside>

        </div>

      )}

    </div>
  );
}

export default Cart;