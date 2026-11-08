
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { getAllUsers } from "../services/authService";
import type { AdminUser } from "../types";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  // Fetch registered users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load users."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Search users by name or email
  const filteredUsers = users.filter((item) => {
    const query = search.toLowerCase().trim();

    return (
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query)
    );
  });

  // Logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Format registration date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="admin-page">
      {/* Navbar */}
      <nav className="admin-nav">
        <div className="admin-brand">
          <img src="/lightresearch-logo.png" alt="LightResearch" />
            <span className="admin-brand-name">
              Light<span className="brand-highlight">Research</span>
            </span>
          <span className="admin-label">ADMIN</span>
        </div>

        <div className="admin-profile">
          <button
            className="admin-profile-btn"
            onClick={() => setProfileOpen(!profileOpen)}
            aria-expanded={profileOpen}
            aria-label="Open profile menu"
          >
            <div className="admin-avatar">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>

            <div className="admin-profile-info">
              <strong>{user?.name || "Administrator"}</strong>
              <span>{user?.email}</span>
            </div>

            <ChevronDown size={16} />
          </button>

          {profileOpen && (
            <div className="admin-dropdown">
              <strong>{user?.name || "Administrator"}</strong>
              <p>{user?.email}</p>

              <button onClick={handleLogout}>
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="admin-content">
        <div className="admin-eyebrow">ADMINISTRATION</div>

        <h1 className="admin-heading">Admin Overview</h1>

        <p className="admin-subtitle">
          Welcome to your LightResearch administration panel.
          View and monitor registered users from one place.
        </p>

        {/* Statistics */}
        <section className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <div className="admin-stat-icon">
                <Users size={19} />
              </div>
            </div>

            <p className="admin-stat-label">Total Registered Users</p>

            <h2 className="admin-stat-value">
              {loading ? "—" : users.length}
            </h2>
          </div>
        </section>

        {/* Users table */}
        <section className="admin-users-section">
          <div className="admin-users-header">
            <div>
              <h2 className="admin-users-title">Registered Users</h2>
              <p className="admin-users-description">
                View the accounts registered on LightResearch.
              </p>
            </div>

            <div className="admin-search">
              <Search size={17} />

              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="admin-message">Loading users...</div>
          ) : error ? (
            <div className="admin-message admin-error" role="alert">
              {error}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="admin-message">
              {search ? "No matching users found." : "No registered users yet."}
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined On</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((item) => (
                    <tr key={item.id}>
                      <td className="admin-user-name">
                        {item.name || "—"}
                      </td>

                      <td>{item.email}</td>

                      <td>
                        <span
                          className={`admin-role admin-role-${item.role}`}
                        >
                          {item.role}
                        </span>
                      </td>

                      <td>{formatDate(item.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
