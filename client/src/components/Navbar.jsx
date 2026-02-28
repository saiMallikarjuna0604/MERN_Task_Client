import React, { useCallback } from "react";

const Navbar = () => {
  let storedUser = null;
  try {
    const raw = localStorage.getItem("user");
    storedUser = raw ? JSON.parse(raw) : null;
  } catch {
    storedUser = null;
  }

  const handleLogout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/logout`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          },
        );
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-brand">CRM Application</div>

      <ul className="navbar-nav">
        <li>
          <a href="/dashboard" className="nav-link">
            Dashboard
          </a>
        </li>
        <li>
          <a href="/activities" className="nav-link">
            Activities
          </a>
        </li>
        <li>
          <span className="nav-link" style={{ cursor: "default" }}>
            Welcome, {storedUser?.username || "User"}
          </span>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{ padding: "5px 10px" }}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
