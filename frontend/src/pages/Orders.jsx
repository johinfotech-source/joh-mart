import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Orders() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      const response = await api.get("/orders/");
      setOrders(response.data);
    } catch (error) {
      console.error(error);
      setError("Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    loadOrders();
  }, [isAuthenticated, navigate]);

  const getStatusClass = (status) => {
    switch (status) {
      case "PLACED":
        return "status-placed";
      case "CONFIRMED":
        return "status-confirmed";
      case "PREPARING":
        return "status-preparing";
      case "OUT_FOR_DELIVERY":
        return "status-delivery";
      case "DELIVERED":
        return "status-delivered";
      case "CANCELLED":
        return "status-cancelled";
      default:
        return "";
    }
  };

  const formatStatus = (status) => {
    return status.replaceAll("_", " ");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="orders-loading-page">
        <div className="orders-loading-card">
          <div className="orders-loading-icon">📦</div>
          <span className="section-label">JOH MART</span>
          <h2>Loading Your Orders...</h2>
          <p>Getting your order history ready</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <section className="orders-header">
        <div className="orders-header-content">
          <span className="section-label">JOH MART • ORDER HISTORY</span>

          <h1>
            Your
            <span> Orders.</span>
          </h1>

          <p>
            Track your ice cream orders and revisit everything
            you've ordered from JOH MART.
          </p>
        </div>

        <Link to="/products" className="orders-shopping-button">
          <span>+</span>
          Continue Shopping
          <b>→</b>
        </Link>
      </section>

      {error && (
        <div className="orders-error-message">
          <span>⚠️</span>
          <div>
            <strong>Unable to load orders</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <section className="empty-orders">
          <div className="empty-orders-glow"></div>

          <div className="empty-orders-icon">📦</div>

          <span className="section-label">YOUR ORDER HISTORY</span>

          <h2>No orders yet</h2>

          <p>
            Your delicious orders will appear here after
            you place your first order.
          </p>

          <Link to="/products" className="orders-shop-button">
            Start Shopping
            <span>🍦</span>
            <b>→</b>
          </Link>
        </section>
      ) : (
        <section className="orders-content">
          <div className="orders-list-header">
            <div>
              <span className="section-label">YOUR HISTORY</span>
              <h2>
                {orders.length}{" "}
                {orders.length === 1 ? "Order" : "Orders"}
              </h2>
            </div>

            <div className="orders-count-badge">
              📦 {orders.length}
            </div>
          </div>

          <div className="orders-list">
            {orders.map((order) => (
              <article key={order.id} className="order-card">
                <div className="order-card-glow"></div>

                <div className="order-card-content">
                  {/* TOP */}
                  <div className="order-card-top">
                    <div className="order-main-info">
                      <div className="order-icon">
                        📦
                      </div>

                      <div>
                        <span className="order-label">
                          ORDER NUMBER
                        </span>

                        <h2>{order.order_number}</h2>

                        <div className="order-date">
                          <span>📅</span>
                          {formatDate(order.created_at)}
                          <span className="date-divider">•</span>
                          <span>🕐</span>
                          {formatTime(order.created_at)}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`order-status ${getStatusClass(
                        order.order_status
                      )}`}
                    >
                      <span className="status-dot"></span>
                      {formatStatus(order.order_status)}
                    </span>
                  </div>

                  {/* MIDDLE */}
                  <div className="order-card-middle">
                    <div className="order-info-box">
                      <span>ITEMS</span>
                      <strong>
                        {order.items.length}
                      </strong>
                    </div>

                    <div className="order-info-box">
                      <span>PAYMENT</span>
                      <strong>
                        {order.payment_method}
                      </strong>
                      <small>
                        {order.payment_status}
                      </small>
                    </div>

                    <div className="order-info-box">
                      <span>ORDER TOTAL</span>
                      <strong>
                        ₹{Number(order.total).toFixed(2)}
                      </strong>
                    </div>
                  </div>

                  {/* BOTTOM */}
                  <div className="order-card-bottom">
                    <div className="order-items-preview">
                      <span className="preview-label">
                        ORDERED ITEMS
                      </span>

                      <div className="order-item-tags">
                        {order.items.slice(0, 3).map((item) => (
                          <span key={item.id}>
                            {item.product_name}
                            {item.quantity > 1 &&
                              ` × ${item.quantity}`}
                          </span>
                        ))}

                        {order.items.length > 3 && (
                          <span className="more-items">
                            +{order.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      to={`/orders/${order.id}`}
                      className="view-order-button"
                    >
                      View Order
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Orders;
