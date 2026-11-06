import { useNavigate } from "react-router-dom";
import { BrainCircuit, Search, FileText, Clock3 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <BrainCircuit color="#a78bfa" size={27} />
          Research<span className="brand-highlight">Mind</span>
        </div>

        <div className="nav-user">
          <div className="avatar">{user?.name.charAt(0).toUpperCase()}</div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <h1>Welcome back, {user?.name} 👋</h1>
        <p className="dashboard-subtitle">
          Your intelligent research workspace.
        </p>

        <section className="welcome-card">
          <h2>Discover. Research. Understand.</h2>
          <p>
            Explore complex topics with ResearchMind's multi-agent AI
            research assistant. Gather information, analyze sources
            and generate comprehensive research reports.
          </p>
        </section>

        <div className="dashboard-grid">
          <div className="stat-card">
            <Search color="#a78bfa" size={22} />
            <p>Research Queries</p>
            <h3>0</h3>
          </div>

          <div className="stat-card">
            <FileText color="#818cf8" size={22} />
            <p>Reports Generated</p>
            <h3>0</h3>
          </div>

          <div className="stat-card">
            <Clock3 color="#38bdf8" size={22} />
            <p>Recent Activity</p>
            <h3>--</h3>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;