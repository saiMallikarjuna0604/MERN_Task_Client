import React, { useCallback } from 'react';

const ContactList = ({ 
  contacts, 
  loading, 
  onEdit, 
  onDelete,
  onLoadMore,
  hasMore,
  totalCount,
}) => {
  const handleEdit = useCallback((contact) => {
    onEdit(contact);
  }, [onEdit]);

  const handleDelete = useCallback(async (contact) => {
    if (window.confirm(`Are you sure you want to delete ${contact?.name}?`)) {
      await onDelete(contact?._id);
    }
  }, [onDelete]);

  const getStatusClass = useCallback((status) => {
    return `status-badge status-${(status ?? '').toLowerCase()}`;
  }, []);

  const formatDate = useCallback((dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : '';
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading contacts...</p>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="card">
        <p style={{ textAlign: 'center', color: '#666' }}>
          No contacts found. Create your first contact to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact?._id}>
              <td>{contact?.name}</td>
              <td>{contact?.email || '-'}</td>
              <td>{contact?.phone || '-'}</td>
              <td>{contact?.company || '-'}</td>
              <td>
                <span className={getStatusClass(contact?.status)}>
                  {contact?.status}
                </span>
              </td>
              <td>{formatDate(contact?.createdAt)}</td>
              <td>
                <div className="contact-actions">
                  <button
                    onClick={() => handleEdit(contact)}
                    className="btn btn-primary"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(contact)}
                    className="btn btn-danger"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <button
            className="page-btn"
            onClick={onLoadMore}
            disabled={!hasMore}
          >
            Load More
          </button>
        </div>
      )}
      
      {typeof totalCount === 'number' && (
        <div style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
          Showing {contacts.length} of {totalCount} contacts
        </div>
      )}
    </div>
  );
};

export default ContactList;
