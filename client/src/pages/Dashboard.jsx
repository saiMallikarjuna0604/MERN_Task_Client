import React, { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce.jsx";
import {
  createContact,
  deleteContact,
  exportContacts,
  getContacts,
  updateContact,
} from "../actions/contactActions";
import ContactList from "../components/ContactList.jsx";
import ContactForm from "../components/ContactForm.jsx";
import Modal from "../components/Modal.jsx";

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [contacts, setContacts] = useState([]);
  const [totalContacts, setTotalContacts] = useState(0);
  const [page, setPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const limit = 10;
  const hasMore = contacts.length < totalContacts;

  const loadContacts = async (pageToLoad = 1, filters = appliedFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getContacts({
        page: pageToLoad,
        limit,
        ...(filters?.search ? { search: filters.search } : {}),
        ...(filters?.status ? { status: filters.status } : {}),
      });

      const rows = data?.contacts || [];
      const total = data?.totalContacts || 0;

      setContacts((prev) => (pageToLoad > 1 ? [...prev, ...rows] : rows));
      setTotalContacts(total);
      setPage(pageToLoad);
      setAppliedFilters(filters);
    } catch (err) {
      setError(err?.message || "Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts(1, appliedFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (
      debouncedSearch === appliedFilters.search &&
      statusFilter === appliedFilters.status
    ) {
      return;
    }

    // load contacts when debounced search or status filter changes
    loadContacts(1, { search: debouncedSearch, status: statusFilter });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, statusFilter, appliedFilters]);

  const handleAddContact = () => {
    setEditingContact(null);
    setShowModal(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingContact(null);
  };

  const handleSaveContact = async (contactData) => {
    try {
      setLoading(true);
      setError(null);

      if (editingContact?._id) {
        const data = await updateContact(editingContact._id, contactData);
        const updated = data?.contact;

        setContacts((prev) =>
          prev.map((c) => (c?._id === editingContact._id ? updated : c)),
        );
      } else {
        const data = await createContact(contactData);
        const created = data?.contact;

        if (created) {
          setContacts((prev) => [created, ...prev]);
          setTotalContacts((t) => t + 1);
        }
      }

      handleCloseModal();
    } catch (err) {
      setError(err?.message || "Failed to save contact");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteContact(id);

      const removed = contacts.some((c) => c?._id === id);
      setContacts((prev) => prev.filter((c) => c?._id !== id));
      if (removed) {
        setTotalContacts((t) => Math.max(0, t - 1));
      }
    } catch (err) {
      setError(err?.message || "Failed to delete contact");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setError(null);
      const csvText = await exportContacts();
      const url = window.URL.createObjectURL(new Blob([csvText]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "contacts.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err?.message || "Failed to export contacts");
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    await loadContacts(1, { search: searchTerm, status: statusFilter });
  };

  const handleLoadMore = async () => {
    if (!hasMore) return;
    await loadContacts(page + 1, appliedFilters);
  };

  const clearError = () => setError(null);

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Contacts Dashboard</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={handleAddContact} className="btn btn-primary">
            Add Contact
          </button>
          <button
            onClick={handleExport}
            className="btn btn-secondary"
            disabled={contacts.length === 0}
          >
            Export CSV
          </button>
        </div>
      </div>

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
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control search-input"
            disabled={contacts.length === 0 && !searchTerm}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
            disabled={contacts.length === 0 && !statusFilter}
          >
            <option value="">All Status</option>
            <option value="Lead">Lead</option>
            <option value="Prospect">Prospect</option>
            <option value="Customer">Customer</option>
          </select>
        </div>
      </div>

      <ContactList
        contacts={contacts}
        loading={loading}
        onEdit={handleEditContact}
        onDelete={handleDeleteContact}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        totalCount={totalContacts}
      />

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingContact ? "Edit Contact" : "Add Contact"}
      >
        <ContactForm
          contact={editingContact}
          onSave={handleSaveContact}
          onCancel={handleCloseModal}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
