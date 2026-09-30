import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [productsResponse, categoriesResponse] =
          await Promise.all([
            api.get("/products/products/"),
            api.get("/products/categories/"),
          ]);

        setProducts(
          Array.isArray(productsResponse.data)
            ? productsResponse.data
            : []
        );

        setCategories(
          Array.isArray(categoriesResponse.data)
            ? categoriesResponse.data
            : []
        );
      } catch (error) {
        console.error(error);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productName = String(
        product?.name || ""
      );

      const matchesSearch = productName
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        String(product?.category ?? "") ===
          String(selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
  };

  if (loading) {
    return (
      <div className="products-loading-page">
        <div className="products-loading-card">
          <div className="products-loading-icon">
            🍦
          </div>

          <h2>Loading JOH MART...</h2>

          <p>Preparing something delicious</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">

      {/* ================= HEADER ================= */}

      <section className="products-header">

        <div className="products-header-content">

          <span className="section-label">
            JOH MART COLLECTION
          </span>

          <h1>
            Find Your
            <br />
            <span>Favourite Ice Cream.</span>
          </h1>

          <p>
            Explore delicious flavours made for every
            mood, celebration and special occasion.
          </p>

        </div>

        <div className="products-header-visual">

          <div className="products-header-glow"></div>

          <div className="products-header-icecream">
            🍨
          </div>

          <div className="products-floating-badge">

            <strong>
              {products.length}+
            </strong>

            <span>
              Flavours
            </span>

          </div>

        </div>

      </section>

      {/* ================= TOOLBAR ================= */}

      <section className="products-toolbar">

        <div className="products-search-wrapper">

          <div className="search-box">

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search your favourite ice cream..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            {search && (

              <button
                className="search-clear-button"
                onClick={() => setSearch("")}
                type="button"
              >
                ×
              </button>

            )}

          </div>

        </div>

        <div className="category-filter-wrapper">

          <div className="category-filter-title">

            <span>
              EXPLORE
            </span>

            <strong>
              Categories
            </strong>

          </div>

          <div className="category-filters">

            <button
              type="button"
              className={
                selectedCategory === "all"
                  ? "category-filter active"
                  : "category-filter"
              }
              onClick={() =>
                setSelectedCategory("all")
              }
            >
              All
            </button>

            {categories.map((category) => (

              <button
                type="button"
                key={category?.id ?? category?.name}
                className={
                  String(selectedCategory) ===
                  String(category?.id ?? "")
                    ? "category-filter active"
                    : "category-filter"
                }
                onClick={() =>
                  setSelectedCategory(category?.id)
                }
              >
                {category?.name || "Category"}
              </button>

            ))}

          </div>

        </div>

      </section>

      {/* ================= ERROR ================= */}

      {error && (

        <div className="products-error">

          <span>
            ⚠️
          </span>

          {error}

        </div>

      )}

      {/* ================= RESULT HEADING ================= */}

      <section className="products-results">

        <div className="products-result-heading">

          <div>

            <span className="section-label">
              OUR COLLECTION
            </span>

            <h2>
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "Product"
                : "Products"}
            </h2>

          </div>

          {(search ||
            selectedCategory !== "all") && (

            <button
              type="button"
              className="clear-filters-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>

          )}

        </div>

        {/* ================= EMPTY ================= */}

        {filteredProducts.length === 0 ? (

          <div className="empty-products">

            <div className="empty-products-icon">
              🍦
            </div>

            <span className="section-label">
              NOTHING HERE
            </span>

            <h2>
              No ice cream found
            </h2>

            <p>
              Try another search or explore a
              different category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
            >
              Explore All Ice Creams
            </button>

          </div>

        ) : (

          /* ================= PRODUCT GRID ================= */

          <div className="product-grid products-page-grid">

            {filteredProducts.map((product) => {

              const productName =
                product?.name ||
                "Unnamed Product";

              const categoryName =
                product?.category_name ||
                "Ice Cream";

              const description =
                product?.description ||
                "Delicious premium ice cream.";

              const finalPrice =
                product?.final_price ??
                product?.price ??
                0;

              const originalPrice =
                product?.price ?? 0;

              const discountPrice =
                product?.discount_price;

              const hasDiscount =
                discountPrice !== null &&
                discountPrice !== undefined &&
                Number(discountPrice) > 0 &&
                Number(discountPrice) <
                  Number(originalPrice);

              const rating =
                product?.rating !== null &&
                product?.rating !== undefined &&
                product?.rating !== ""
                  ? product.rating
                  : null;

              const imageUrl =
                product?.image || "";

              return (

                <article
                  key={product?.id ?? productName}
                  className="product-card"
                >

                  {/* ================= PRODUCT IMAGE ================= */}

                  <div className="product-image">

                    {imageUrl ? (

                      <img
                        src={imageUrl}
                        alt={productName}
                        loading="lazy"
                      />

                    ) : (

                      <span className="product-placeholder">
                        🍦
                      </span>

                    )}

                  </div>

                  {/* ================= PRODUCT INFO ================= */}

                  <div className="product-info">

                    <span className="product-category">
                      {categoryName}
                    </span>

                    {/* Rating + Offer */}

                    <div className="product-rating-row">

                      {rating !== null ? (

                        <span className="product-rating">
                          ★ {rating}
                        </span>

                      ) : (

                        <span className="product-rating">
                          New
                        </span>

                      )}

                      {hasDiscount && (

                        <span className="product-offer">
                          OFFER
                        </span>

                      )}

                    </div>

                    <h3>
                      {productName}
                    </h3>

                    <p className="product-description">
                      {description}
                    </p>

                    <div className="product-bottom">

                      <div className="product-price">

                        <strong>
                          ₹
                          {Number(finalPrice).toFixed(2)}
                        </strong>

                        {hasDiscount && (

                          <del>
                            ₹
                            {Number(
                              originalPrice
                            ).toFixed(2)}
                          </del>

                        )}

                      </div>

                      {product?.id ? (

                        <Link
                          to={`/products/${product.id}`}
                          className="view-product-btn"
                        >
                          View
                          <span>
                            →
                          </span>
                        </Link>

                      ) : (

                        <span className="view-product-btn disabled">
                          Unavailable
                        </span>

                      )}

                    </div>

                  </div>

                </article>

              );
            })}

          </div>

        )}

      </section>

    </div>
  );
}

export default Products;
