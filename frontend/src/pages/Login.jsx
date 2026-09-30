import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      await login(
        form.username,
        form.password
      );

      const from =
        location.state?.from?.pathname || "/";

      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.detail ||
        "Invalid username or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <section className="auth-visual">

        <div className="auth-visual-content">

          <span className="hero-badge">
            🍦 JOH MART
          </span>

          <h1>
            Sweet moments
            <br />
            start here.
          </h1>

          <p>
            Discover delicious ice creams
            for every mood and occasion.
          </p>

          <div className="auth-icecream">
            🍨
          </div>

        </div>

      </section>

      <section className="auth-form-section">

        <div className="auth-form-card">

          <div className="auth-mobile-logo">
            🍦 JOH MART
          </div>

          <span className="section-label">
            WELCOME BACK
          </span>

          <h2>
            Login to your account
          </h2>

          <p className="auth-description">
            Enter your details to continue
            shopping with JOH MART.
          </p>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="form-field">
              <label>
                Username
              </label>

              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your username"
                autoComplete="username"
                required
              />
            </div>

            <div className="form-field">
              <label>
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit-button"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login →"}
            </button>

          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <p className="auth-register-text">
            Don't have an account?
            {" "}
            <Link to="/register">
              Create one
            </Link>
          </p>

          <Link
            to="/"
            className="auth-home-link"
          >
            ← Back to JOH MART
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Login;