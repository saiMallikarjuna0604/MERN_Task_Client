import React, { useEffect, useState } from "react";
import { getActivities } from "../actions/activityActions";

const Activities = () => {
  const [actionFilter, setActionFilter] = useState("");

  const [activities, setActivities] = useState([]);
  const [totalActivities, setTotalActivities] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const limit = 20;
  const hasMore = activities.length < totalActivities;

  const loadActivities = async (pageToLoad = 1, action = actionFilter) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getActivities({
        page: pageToLoad,
        limit,
        ...(action ? { action } : {}),
      });

      const rows = data?.activities || [];
      const total = data?.totalActivities || 0;

      setActivities((prev) => (pageToLoad > 1 ? [...prev, ...rows] : rows));
      setTotalActivities(total);
      setPage(pageToLoad);
    } catch (err) {
      setError(err?.message || "Failed to fetch activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities(1, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = async (action) => {
    setActionFilter(action);
    await loadActivities(1, action);
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleString() : "";
  };

  const getActionIcon = (action) => {
    switch (action) {
      case "create":
        return "➕";
      case "update":
        return "✏️";
      case "delete":
        return "🗑️";
      default:
        return "📝";
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case "create":
        return "#28a745";
      case "update":
        return "#007bff";
      case "delete":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const clearError = () => setError(null);

  const handleLoadMore = async () => {
    if (!hasMore) return;
    await loadActivities(page + 1, actionFilter);
  };

  return (
    <div className="container">
      <h1>Activity Logs</h1>

      {error && (
        <div className="alert alert-danger">
          {error}
          <button
            onClick={clearError}
            style={{
              float: "right",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            &times;
          </button>
        </div>
      )}

      <div className="card">
        <div className="search-box">
          <select
            value={actionFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="filter-select"
          >
            <option value="">All Actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading activities...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: "center", color: "#666" }}>
            No activities found.
          </p>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Resource</th>
                <th>User</th>
                <th>Date</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity?._id}>
                  <td>
                    <span
                      style={{
                        color: getActionColor(activity?.action),
                        fontWeight: "bold",
                      }}
                    >
                      {getActionIcon(activity?.action)}{" "}
                      {(activity?.action ?? "").toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <strong>{activity?.resourceName}</strong>
                    <br />
                    <small style={{ color: "#666" }}>
                      {activity?.resourceType} ID: {activity?.resourceId}
                    </small>
                  </td>
                  <td>
                    {activity?.userId?.username || "Unknown User"}
                    <br />
                    <small style={{ color: "#666" }}>
                      {activity?.userId?.email || ""}
                    </small>
                  </td>
                  <td>{formatDate(activity?.createdAt)}</td>
                  <td>
                    <small style={{ color: "#666" }}>
                      {activity?.details &&
                        typeof activity.details === "object" && (
                          <div>
                            {activity.details?.updatedFields && (
                              <div>
                                Updated:{" "}
                                {Object.keys(
                                  activity.details.updatedFields,
                                ).join(", ")}
                              </div>
                            )}
                            {activity.details?.contactData && (
                              <div>
                                Contact created with{" "}
                                {
                                  Object.keys(activity.details.contactData)
                                    .length
                                }{" "}
                                fields
                              </div>
                            )}
                            {activity.details?.deletedContact && (
                              <div>
                                Contact deleted:{" "}
                                {activity.details.deletedContact.name}
                              </div>
                            )}
                          </div>
                        )}
                    </small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {hasMore && (
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <button
                className="page-btn"
                onClick={handleLoadMore}
                disabled={!hasMore}
              >
                Load More
              </button>
            </div>
          )}

          {typeof totalActivities === "number" && (
            <div
              style={{ textAlign: "center", marginTop: "10px", color: "#666" }}
            >
              Showing {activities.length} of {totalActivities} activities
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Activities;
