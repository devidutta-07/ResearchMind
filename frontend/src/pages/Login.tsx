import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  ArrowRight,
  BrainCircuit,
  Eye,
  EyeOff,
  Mail,
  Lock,
} from "lucide-react";

const Login = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const user = loginUser(email, password);
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow glow-one" />
      <div className="auth-glow glow-two" />

      <header className="auth-brand">
        <div className="brand-icon"><BrainCircuit size={23} /></div>
        <span>Research<span className="brand-highlight">Mind</span></span>
      </header>

      <main className="auth-container">
        <div className="auth-heading">
          <div className="eyebrow">WELCOME BACK</div>
          <h1>Welcome back.</h1>
          <p>Sign in to continue your research journey.</p>
        </div>

        <div className="auth-card">
          <div className="social-buttons">
            <button className="social-btn" type="button"
              onClick={() => alert("Google sign-in will be enabled with Supabase.")}>
              <Mail size={18} /> Google
            </button>
    
          </div>

          <div className="auth-divider">
            <span>OR CONTINUE WITH EMAIL</span>
          </div>

          <form onSubmit={handleLogin}>
            <label>Email address</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="password-label">
              <label>Password</label>
              <a href="#" onClick={(e) => {
                e.preventDefault();
                alert("Password reset will be enabled with Supabase.");
              }}>Forgot password?</a>
            </div>

            <div className="input-wrapper">
              <Lock size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="primary-btn">
              Sign in <ArrowRight size={18} />
            </button>
          </form>
        </div>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Create account</Link>
        </p>

        <div className="auth-footer">
          © 2026 ResearchMind. Intelligent research, simplified.
        </div>
      </main>
    </div>
  );
};

export default Login;