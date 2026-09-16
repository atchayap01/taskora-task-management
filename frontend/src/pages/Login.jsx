import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.email.trim() || !formData.password) {
      return "Please fill in both email and password";
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      await login(formData.email.trim(), formData.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
  <div className="auth-page">
    <div className="auth-layout">

      {/* Branding panel */}
      <div className="auth-showcase">
        <div className="showcase-brand">
          <Logo size={48} />

          <div>
            <h1>Taskora</h1>
            <p>Plan. Prioritize. Get things done.</p>
          </div>
        </div>

        <div className="showcase-content">
          <span className="showcase-eyebrow">YOUR PRODUCTIVITY SPACE</span>

          <h2>
            Turn your plans
            <br />
            into <span>progress.</span>
          </h2>

          <p>
            Organize your tasks, track your progress, and stay focused on
            what matters most.
          </p>

          <div className="showcase-features">
            <div className="showcase-feature">
              <span>✓</span>
              <p>Organize tasks effortlessly</p>
            </div>

            <div className="showcase-feature">
              <span>✓</span>
              <p>Track your progress</p>
            </div>

            <div className="showcase-feature">
              <span>✓</span>
              <p>Stay productive every day</p>
            </div>
          </div>
        </div>

        <div className="showcase-decoration decoration-one"></div>
        <div className="showcase-decoration decoration-two"></div>
      </div>

      {/* Login form */}
      <div className="auth-form-section">
        <div className="auth-card">

          <div className="mobile-auth-brand">
            <Logo size={42} />
            <div>
              <h1>Taskora</h1>
              <p>Plan. Prioritize. Get things done.</p>
            </div>
          </div>

          <div className="auth-heading">
            <h2>Welcome back 👋</h2>
            <p>Log in to continue managing your tasks.</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>

            <div className="form-group">
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <div className="password-label-row">
                <label htmlFor="password">Password</label>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block auth-submit"
              disabled={submitting}
            >
              {submitting ? "Logging in..." : "Log In"}
            </button>

          </form>

          <p className="auth-footer">
            Don&apos;t have an account?{" "}
            <Link to="/register">Create one</Link>
          </p>

        </div>
      </div>

    </div>
  </div>
);
};

export default Login;
