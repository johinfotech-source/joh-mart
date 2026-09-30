import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
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
      await register(form);

      navigate("/login", {
        replace: true,
        state: {
          registered: true,
        },
      });
    } catch (error) {
      console.error(error);

      const backendError =
        error.response?.data;

      if (backendError) {
        const messages = Object.values(
          backendError
        )
          .flat()
          .join(" ");

        setError(
          messages || "Unable to create account."
        );
      } else {
        setError(
          "Unable to create account. Please try again."
        );
      }
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
            Create your
            <br />
            sweet account.
          </h1>

          <p>
            Join JOH MART and discover
            delicious ice creams for
            every special moment.
          </p>

          <div className="auth-icecream">
            🍦
          </div>

        </div>

      </section>

      <section className="auth-form-section">

        <div className="auth-form-card">

          <div className="auth-mobile-logo">
            🍦 JOH MART
          </div>

          <span className="section-label">
            JOIN JOH MART
          </span>

          <h2>
            Create an account
          </h2>

          <p className="auth-description">
            Create your account and start
            shopping your favourite ice creams.
          </p>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="auth-name-row">

              <div className="form-field">
                <label>
                  First Name
                </label>

                <input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="First name"
                  required
                />
              </div>

              <div className="form-field">
                <label>
                  Last Name
                </label>

                <input
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Last name"
                />
              </div>

            </div>

            <div className="form-field">
              <label>
                Username
              </label>

              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Choose a username"
                autoComplete="username"
                required
              />
            </div>

            <div className="form-field">
              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
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
                placeholder="Minimum 6 characters"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit-button"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account →"}
            </button>

          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <p className="auth-register-text">
            Already have an account?
            {" "}
            <Link to="/login">
              Login
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

export default Register;