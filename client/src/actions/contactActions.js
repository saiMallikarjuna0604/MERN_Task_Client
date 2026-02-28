const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

export const getContacts = async (params = {}) => {
  const query = buildQueryString(params);
  const response = await fetch(`${API_BASE_URL}/contacts${query}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || 'Failed to fetch contacts';
    throw new Error(message);
  }

  return data;
};

export const createContact = async (contactData) => {
  const response = await fetch(`${API_BASE_URL}/contacts`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(contactData),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || 'Failed to create contact';
    throw new Error(message);
  }

  return data;
};

export const updateContact = async (id, contactData) => {
  const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(contactData),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || 'Failed to update contact';
    throw new Error(message);
  }

  return data;
};

export const deleteContact = async (id) => {
  const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let data = {};
    try {
      data = await response.json();
    } catch {
      // ignore
    }
    const message = data?.message || 'Failed to delete contact';
    throw new Error(message);
  }

  return { success: true };
};

export const exportContacts = async () => {
  const response = await fetch(`${API_BASE_URL}/contacts/export`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let data = {};
    try {
      data = await response.json();
    } catch {
      // ignore
    }
    const message = data?.message || 'Failed to export contacts';
    throw new Error(message);
  }

  const text = await response.text();
  return text;
};

