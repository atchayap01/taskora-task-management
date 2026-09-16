import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      return "Please fill in all fields";
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters";
    }
   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return "Please enter a valid email address";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match";
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
      await register(
        formData.name.trim(),
        formData.email.trim(),
        formData.password,
        formData.confirmPassword
      );
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
          <span className="showcase-eyebrow">START YOUR JOURNEY</span>

          <h2>
            Build better
            <br />
            <span>habits.</span> Get more done.
          </h2>

          <p>
            Create your personal workspace and turn everyday tasks
            into meaningful progress.
          </p>

          <div className="showcase-features">
            <div className="showcase-feature">
              <span>✓</span>
              <p>Keep everything organized</p>
            </div>

            <div className="showcase-feature">
              <span>✓</span>
              <p>Prioritize what matters</p>
            </div>

            <div className="showcase-feature">
              <span>✓</span>
              <p>Track every accomplishment</p>
            </div>
          </div>
        </div>

        <div className="showcase-decoration decoration-one"></div>
        <div className="showcase-decoration decoration-two"></div>
      </div>

      {/* Registration form */}
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
            <h2>Create your account ✨</h2>
            <p>Set up your workspace and start getting things done.</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>

            <div className="form-group">
              <label htmlFor="name">Full name</label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>

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
              <label htmlFor="password">Password</label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm password</label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block auth-submit"
              disabled={submitting}
            >
              {submitting ? "Creating account..." : "Create Account"}
            </button>

          </form>

          <p className="auth-footer">
            Already have an account?{" "}
            <Link to="/login">Log in</Link>
          </p>

        </div>
      </div>

    </div>
  </div>
);
};

export default Register;
