import React, { useState, useEffect, useCallback } from "react";

const ContactForm = ({ contact, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "Lead",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact?.name || "",
        email: contact?.email || "",
        phone: contact?.phone || "",
        company: contact?.company || "",
        status: contact?.status || "Lead",
        notes: contact?.notes || "",
      });
    }
  }, [contact]);

  const validateForm = useCallback(() => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear error for this field when user starts typing
      if (formErrors?.[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [formErrors],
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      onSave(formData);
    },
    [formData, validateForm, onSave],
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="name">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className={`form-control ${formErrors?.name ? "is-invalid" : ""}`}
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter contact name"
          disabled={loading}
          required
        />
        {formErrors?.name && <div className="error">{formErrors.name}</div>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className={`form-control ${formErrors?.email ? "is-invalid" : ""}`}
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email address"
          disabled={loading}
        />
        {formErrors?.email && <div className="error">{formErrors.email}</div>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="phone">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="form-control"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="company">
          Company
        </label>
        <input
          type="text"
          id="company"
          name="company"
          className="form-control"
          value={formData.company}
          onChange={handleChange}
          placeholder="Enter company name"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          name="status"
          className="form-control"
          value={formData.status}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="Lead">Lead</option>
          <option value="Prospect">Prospect</option>
          <option value="Customer">Customer</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          className="form-control"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Enter notes"
          rows="4"
          disabled={loading}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          justifyContent: "flex-end",
          marginTop: "15px",
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={loading}
          style={{ padding: "8px 16px", fontSize: "13px" }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ padding: "8px 16px", fontSize: "13px" }}
        >
          {loading ? "Saving..." : contact ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
