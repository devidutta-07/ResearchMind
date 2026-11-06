import { useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  Users,
  FileText,
  Activity,
  Search,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const AdminDashboard = () => {
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
          <span style={{ fontSize: 10, color: "#a78bfa" }}>ADMIN</span>
        </div>

        <div className="nav-user">
          <div className="avatar">A</div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="eyebrow">ADMINISTRATION</div>
        <h1>Admin Dashboard</h1>
        <p className="dashboard-subtitle">
          Welcome, {user?.name}. Manage and monitor ResearchMind.
        </p>

        <div className="dashboard-grid">
          <div className="stat-card">
            <Users color="#a78bfa" size={23} />
            <p>Total Users</p>
            <h3>0</h3>
          </div>

          <div className="stat-card">
            <Search color="#818cf8" size={23} />
            <p>Total Research Queries</p>
            <h3>0</h3>
          </div>

          <div className="stat-card">
            <FileText color="#38bdf8" size={23} />
            <p>Reports Generated</p>
            <h3>0</h3>
          </div>
        </div>

        <section className="welcome-card">
          <Activity color="#a78bfa" size={25} />
          <h2>Platform Overview</h2>
          <p>
            Monitor user activity, research generation and overall
            platform performance. Analytics will be connected to
            the database in a later phase.
          </p>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;