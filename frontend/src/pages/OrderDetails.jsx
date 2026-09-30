import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}/`);
      setOrder(response.data);
    } catch (error) {
      console.error(error);
      setError("Unable to load order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const statusSteps = [
    {
      key: "PLACED",
      label: "Order Placed",
      icon: "📝",
    },
    {
      key: "CONFIRMED",
      label: "Confirmed",
      icon: "✓",
    },
    {
      key: "PREPARING",
      label: "Preparing",
      icon: "🍦",
    },
    {
      key: "OUT_FOR_DELIVERY",
      label: "Out for Delivery",
      icon: "🚚",
    },
    {
      key: "DELIVERED",
      label: "Delivered",
      icon: "📦",
    },
  ];

  const getStatusIndex = (status) => {
    return statusSteps.findIndex(
      (step) => step.key === status
    );
  };

  if (loading) {
    return (
      <div className="order-details-loading">
        <h2>Loading order...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-details-error">
        <h2>{error}</h2>

        <Link to="/orders">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return <p>Order not found.</p>;
  }

  const currentStatusIndex = getStatusIndex(
    order.order_status
  );

  const isCancelled =
    order.order_status === "CANCELLED";

  const address = order.address_details;

  return (
    <div className="order-details-page">

      {/* HEADER */}

      <div className="order-details-header">

        <div>
          <span className="section-label">
            JOH MART
          </span>

          <h1>Order Details</h1>

          <p>
            Order #{order.order_number}
          </p>
        </div>

        <Link
          to="/orders"
          className="continue-shopping"
        >
          ← My Orders
        </Link>

      </div>

      {/* TRACKING */}

      <section className="order-tracking-card">

        <div className="tracking-heading">

          <div>
            <span className="section-label">
              ORDER TRACKING
            </span>

            <h2>
              {isCancelled
                ? "Order Cancelled"
                : "Your order is on its way"}
            </h2>
          </div>

          <span
            className={
              isCancelled
                ? "tracking-status cancelled"
                : "tracking-status"
            }
          >
            {order.order_status.replaceAll(
              "_",
              " "
            )}
          </span>

        </div>

        {!isCancelled && (
          <div className="tracking-steps">

            {statusSteps.map(
              (step, index) => {

                const completed =
                  index <= currentStatusIndex;

                const active =
                  index === currentStatusIndex;

                return (
                  <div
                    key={step.key}
                    className={
                      completed
                        ? "tracking-step completed"
                        : "tracking-step"
                    }
                  >

                    <div
                      className={
                        active
                          ? "tracking-icon active"
                          : "tracking-icon"
                      }
                    >
                      {step.icon}
                    </div>

                    <strong>
                      {step.label}
                    </strong>

                    {active && (
                      <span>
                        Current
                      </span>
                    )}

                    {index <
                      statusSteps.length - 1 && (
                      <div
                        className={
                          index <
                          currentStatusIndex
                            ? "tracking-line completed"
                            : "tracking-line"
                        }
                      />
                    )}

                  </div>
                );
              }
            )}

          </div>
        )}

        {isCancelled && (
          <div className="cancelled-message">
            ❌ This order has been cancelled.
          </div>
        )}

      </section>

      {/* MAIN CONTENT */}

      <div className="order-details-layout">

        <main>

          {/* ITEMS */}

          <section className="order-details-section">

            <div className="details-section-heading">

              <span className="section-label">
                ORDER ITEMS
              </span>

              <h2>
                {order.items.length}{" "}
                Item
                {order.items.length !== 1
                  ? "s"
                  : ""}
              </h2>

            </div>

            <div className="order-detail-items">

              {order.items.map((item) => (

                <div
                  key={item.id}
                  className="order-detail-item"
                >

                  <div className="order-detail-image">

                    {item.product_image ? (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                      />
                    ) : (
                      <span>🍦</span>
                    )}

                  </div>

                  <div className="order-detail-item-info">

                    <h3>
                      {item.product_name}
                    </h3>

                    <p>
                      ₹{item.price} ×{" "}
                      {item.quantity}
                    </p>

                  </div>

                  <strong>
                    ₹{item.total}
                  </strong>

                </div>

              ))}

            </div>

          </section>

          {/* PAYMENT */}

          <section className="order-details-section">

            <div className="details-section-heading">

              <span className="section-label">
                PAYMENT
              </span>

              <h2>
                Payment Details
              </h2>

            </div>

            <div className="payment-detail-grid">

              <div>
                <span>Method</span>

                <strong>
                  💵 {order.payment_method}
                </strong>
              </div>

              <div>
                <span>Status</span>

                <strong>
                  {order.payment_status}
                </strong>
              </div>

            </div>

          </section>

        </main>

        {/* SIDEBAR */}

        <aside>

          {/* BILL */}

          <section className="order-bill-card">

            <span className="section-label">
              BILL SUMMARY
            </span>

            <h2>
              Order Total
            </h2>

            <div className="bill-row">
              <span>Subtotal</span>
              <strong>
                ₹{order.subtotal}
              </strong>
            </div>

            <div className="bill-row">
              <span>Delivery Fee</span>
              <strong>
                ₹{order.delivery_fee}
              </strong>
            </div>

            <hr />

            <div className="bill-total">
              <span>Total</span>

              <strong>
                ₹{order.total}
              </strong>
            </div>

          </section>

          {/* ADDRESS */}

          <section className="delivery-info-card">

            <span className="section-label">
              DELIVERY
            </span>

            <h2>
              Delivery Address
            </h2>

            {address ? (
              <div className="order-address-details">

                <strong>
                  {address.name}
                </strong>

                <p>
                  📞 {address.phone}
                </p>

                <p>
                  {address.address_line}
                </p>

                <p>
                  {address.city} -{" "}
                  {address.pincode}
                </p>

                {address.landmark && (
                  <p>
                    📌 {address.landmark}
                  </p>
                )}

              </div>
            ) : (
              <p>
                Delivery address unavailable.
              </p>
            )}

            <div className="order-placed-info">

              Order placed on:
              <br />

              {new Date(
                order.created_at
              ).toLocaleString()}

            </div>

          </section>

        </aside>

      </div>

      <Link
        to="/products"
        className="order-continue-shopping"
      >
        Continue Shopping →
      </Link>

    </div>
  );
}

export default OrderDetails;