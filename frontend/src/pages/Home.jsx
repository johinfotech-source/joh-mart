import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user, isAuthenticated } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [productsResponse, categoriesResponse] =
          await Promise.all([
            api.get("/products/products/"),
            api.get("/products/categories/"),
          ]);

        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Home loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  if (loading) {
    return (
      <div className="home-loading">
        <div className="home-loading-glass">
          <div className="loading-icecream">🍦</div>
          <h2>Loading JOH MART...</h2>
          <p>Getting something sweet for you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">

      {/* ================= HERO ================= */}
      <section className="hero-section">

        <div className="hero-glow hero-glow-one"></div>
        <div className="hero-glow hero-glow-two"></div>

        <div className="hero-content">

          <span className="hero-badge">
            <span className="hero-badge-dot"></span>
            JOH MART • PREMIUM ICE CREAM
          </span>

          <h1>
            Sweet Moments.
            <br />
            <span>Perfectly Chilled.</span>
          </h1>

          <p>
            Premium ice cream delivered for birthdays,
            weddings, celebrations and every special
            moment worth remembering.
          </p>

          <div className="hero-actions">

            <Link
              to="/products"
              className="hero-primary-btn"
            >
              Shop Ice Cream
              <span>→</span>
            </Link>

            <Link
              to="/products"
              className="hero-secondary-btn"
            >
              Explore Menu
            </Link>

          </div>

          <div className="hero-trust">

            <div className="hero-trust-item">
              <strong>🍨</strong>
              <span>Premium Taste</span>
            </div>

            <div className="hero-trust-divider"></div>

            <div className="hero-trust-item">
              <strong>🎉</strong>
              <span>Event Ready</span>
            </div>

            <div className="hero-trust-divider"></div>

            <div className="hero-trust-item">
              <strong>🚚</strong>
              <span>Fast Delivery</span>
            </div>

          </div>

        </div>

        <div className="hero-visual">

          <div className="hero-orbit orbit-one"></div>
          <div className="hero-orbit orbit-two"></div>

          <div className="hero-icecream-card">

            <div className="floating-sparkle sparkle-one">
              ✦
            </div>

            <div className="floating-sparkle sparkle-two">
              ✦
            </div>

            <div className="hero-icecream">
              🍨
            </div>

            <div className="hero-icecream-shadow"></div>

          </div>

          <div className="floating-mini-card mini-card-one">
            <span>⭐</span>
            <div>
              <strong>4.8</strong>
              <small>Customer Rating</small>
            </div>
          </div>

          <div className="floating-mini-card mini-card-two">
            <span>🍦</span>
            <div>
              <strong>Fresh</strong>
              <small>Every Order</small>
            </div>
          </div>

        </div>

      </section>

      {/* ================= WELCOME ================= */}
      {isAuthenticated && user && (
        <section className="welcome-section">

          <div className="welcome-icon">
            👋
          </div>

          <div>
            <span className="section-label">
              WELCOME BACK
            </span>

            <h2>
              Hello, {user.first_name || user.username}
            </h2>

            <p>
              Ready to find your favourite ice cream?
            </p>
          </div>

          <Link
            to="/products"
            className="welcome-action"
          >
            Start Shopping →
          </Link>

        </section>
      )}

      {/* ================= CATEGORIES ================= */}
      <section className="home-section">

        <div className="section-heading">

          <div>
            <span className="section-label">
              EXPLORE COLLECTION
            </span>

            <h2>Shop by Category</h2>

            <p className="section-subtitle">
              Find the perfect treat for every mood.
            </p>
          </div>

          <Link
            to="/products"
            className="section-view-all"
          >
            View All <span>→</span>
          </Link>

        </div>

        <div className="category-grid">

          {categories.map((category, index) => (
            <Link
              key={category.id}
              to="/products"
              className="category-card"
            >

              <div className="category-number">
                0{index + 1}
              </div>

              <div className="category-icon">
                🍨
              </div>

              <div className="category-card-content">

                <h3>{category.name}</h3>

                <span>
                  Explore Collection
                  <b>→</b>
                </span>

              </div>

            </Link>
          ))}

        </div>

      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="home-section products-home-section">

        <div className="section-heading">

          <div>
            <span className="section-label">
              CUSTOMER FAVOURITES
            </span>

            <h2>Popular Ice Creams</h2>

            <p className="section-subtitle">
              Little cups of happiness, ready for you.
            </p>
          </div>

          <Link
            to="/products"
            className="section-view-all"
          >
            View All <span>→</span>
          </Link>

        </div>

        <div className="product-grid">

          {products.slice(0, 6).map((product) => (
            <article
              key={product.id}
              className="product-card"
            >

              <div className="product-image">

                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                  />
                ) : (
                  <span className="product-placeholder">
                    🍦
                  </span>
                )}

                <span className="product-floating-badge">
                  {product.rating
                    ? `★ ${product.rating}`
                    : "NEW"}
                </span>

              </div>

              <div className="product-info">

                <span className="product-category">
                  {product.category_name}
                </span>

                <h3>{product.name}</h3>

                <p className="product-description">
                  {product.description ||
                    "Delicious premium ice cream."}
                </p>

                <div className="product-bottom">

                  <div className="product-price">

                    <strong>
                      ₹{product.final_price}
                    </strong>

                    {product.discount_price && (
                      <del>
                        ₹{product.price}
                      </del>
                    )}

                  </div>

                  <Link
                    to={`/products/${product.id}`}
                    className="view-product-btn"
                  >
                    View
                  </Link>

                </div>

              </div>

            </article>
          ))}

        </div>

      </section>

      {/* ================= EVENT BANNER ================= */}
      <section className="event-banner">

        <div className="event-banner-glow"></div>

        <div className="event-banner-content">

          <span className="event-banner-label">
            FOR EVERY SPECIAL MOMENT
          </span>

          <h2>
            Planning an Event?
          </h2>

          <p>
            Make your celebration sweeter with
            premium JOH MART ice cream.
          </p>

          <Link
            to="/products"
            className="event-button"
          >
            Explore Ice Creams
            <span>→</span>
          </Link>

        </div>

        <div className="event-visual">
          🍦
        </div>

      </section>

    </div>
  );
}

export default Home;