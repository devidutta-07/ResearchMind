import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
} from "lucide-react";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
    />
  </svg>
);

const Signup = () => {
  const { signupUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  
const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (password.length < 6) {
    setError("Password must be at least 6 characters");
    return;
  }

  try {
    await signupUser(name, email, password);
    navigate("/dashboard");
  } catch (err) {
    setError(
      err instanceof Error ? err.message : "Something went wrong"
    );
  }
};


  return (
    <div className="auth-page">
      <header className="auth-brand">
        <img
          src="/lightresearch-logo.png"
          alt="LightResearch logo"
          className="brand-logo"
        />
        <span>
          Light<span className="brand-highlight">Research</span>
        </span>
      </header>

      <main className="auth-container">
        <div className="auth-heading">
          <span className="eyebrow">GET STARTED</span>
          <h1>Create an account</h1>
          <p>Start exploring knowledge with intelligent AI agents.</p>
        </div>

        <div className="auth-card">
          <button
            className="social-btn"
            type="button"
            onClick={() =>
              alert("Google sign-up will be enabled with Supabase.")
            }
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="auth-divider">
            <span>or sign up with email</span>
          </div>

          <form onSubmit={handleSignup}>
            <div className="field">
              <label htmlFor="signup-name">Full name</label>
              <div className="input-wrapper">
                <User size={17} />
                <input
                  id="signup-name"
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="signup-email">Email address</label>
              <div className="input-wrapper">
                <Mail size={17} />
                <input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="signup-password">Password</label>
              <div className="input-wrapper">
                <Lock size={17} />
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-error" role="alert">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="primary-btn">
              Create account <ArrowRight size={17} />
            </button>
          </form>
        </div>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>

        <footer className="auth-footer">
          © 2026 LightResearch. Intelligent research, simplified.
        </footer>
      </main>
    </div>
  );
};

export default Signup;