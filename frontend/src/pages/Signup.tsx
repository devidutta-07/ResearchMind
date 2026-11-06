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
  User,
} from "lucide-react";

const Signup = () => {
  const { signupUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      signupUser(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
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
          <div className="eyebrow">GET STARTED</div>
          <h1>Create an account.</h1>
          <p>Start exploring knowledge with intelligent AI agents.</p>
        </div>

        <div className="auth-card">
          <div className="social-buttons">
            <button className="social-btn" type="button"
              onClick={() => alert("Google sign-up will be enabled with Supabase.")}>
              <Mail size={18} /> Google
            </button>
    
          </div>

          <div className="auth-divider">
            <span>OR SIGN UP WITH EMAIL</span>
          </div>

          <form onSubmit={handleSignup}>
            <label>Full name</label>
            <div className="input-wrapper">
              <User size={18} />
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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

            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 6 characters"
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
              Create account <ArrowRight size={18} />
            </button>
          </form>
        </div>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>

        <div className="auth-footer">
          © 2026 ResearchMind. Intelligent research, simplified.
        </div>
      </main>
    </div>
  );
};

export default Signup;