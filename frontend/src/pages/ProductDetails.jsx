import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await api.get(`/products/products/${id}/`);
        setProduct(response.data);
      } catch (error) {
        console.error(error);
        setError("Unable to load product.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity((current) => current + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((current) => current - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setAdding(true);
    setError("");
    setMessage("");

    try {
      await api.post("/cart/add/", {
        product: product.id,
        quantity,
      });

      setMessage("Added to cart successfully!");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.error ||
          "Unable to add product to cart."
      );
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="product-details-loading">
        <h2>Loading product...</h2>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="product-details-error">
        <h2>{error}</h2>

        <Link to="/products">
          ← Back to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  const hasDiscount =
    product.discount_price !== null &&
    product.discount_price !== undefined;

  const isOutOfStock = product.stock === 0;

  return (
    <div className="product-details-page">

      <Link
        to="/products"
        className="product-back-link"
      >
        ← Back to Products
      </Link>

      <section className="product-details-card">

        <div className="product-details-image">

          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
            />
          ) : (
            <span>🍦</span>
          )}

        </div>

        <div className="product-details-info">

          <span className="product-details-category">
            {product.category_name}
          </span>

          <h1>{product.name}</h1>

          <div className="product-details-rating">
            ⭐ {product.rating}
          </div>

          <p className="product-details-description">
            {product.description ||
              "Delicious premium ice cream made for every special moment."}
          </p>

          <div className="product-details-price">

            <strong>
              ₹{product.final_price}
            </strong>

            {hasDiscount && (
              <del>
                ₹{product.price}
              </del>
            )}

            {hasDiscount && (
              <span className="discount-badge">
                OFFER
              </span>
            )}

          </div>

          <div className="stock-status">
            {isOutOfStock ? (
              <span className="out-of-stock">
                ❌ Out of Stock
              </span>
            ) : (
              <span className="in-stock">
                ✓ {product.stock} available
              </span>
            )}
          </div>

          {!isOutOfStock && (
            <div className="quantity-section">

              <span>Quantity</span>

              <div className="quantity-control">

                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  −
                </button>

                <strong>{quantity}</strong>

                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>

              </div>

            </div>
          )}

          {message && (
            <div className="success-message">
              ✓ {message}
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            className="add-cart-large"
            onClick={handleAddToCart}
            disabled={adding || isOutOfStock}
          >
            {adding
              ? "Adding to Cart..."
              : isOutOfStock
              ? "Out of Stock"
              : "🛒 Add to Cart"}
          </button>

          <Link
            to="/cart"
            className="go-cart-link"
          >
            View Cart →
          </Link>

        </div>

      </section>

      <section className="product-benefits">

        <div>
          <span>🍦</span>
          <strong>Premium Quality</strong>
          <p>Fresh and delicious ice cream.</p>
        </div>

        <div>
          <span>🚚</span>
          <strong>Quick Delivery</strong>
          <p>Fast delivery to your doorstep.</p>
        </div>

        <div>
          <span>🎉</span>
          <strong>Perfect for Events</strong>
          <p>Great for celebrations and parties.</p>
        </div>

      </section>

    </div>
  );
}

export default ProductDetails;