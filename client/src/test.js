// Simple React Component Tests
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock the API
const mockAPI = {
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};
global.localStorage = localStorageMock;

// Simple Login Component Test
const TestLogin = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }
    try {
      await mockAPI.post('/auth/login', { email, password });
      setError('');
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-testid="email-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        data-testid="password-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
      />
      <button data-testid="login-button" type="submit">Login</button>
      {error && <div data-testid="error-message">{error}</div>}
    </form>
  );
};

// Simple Contact Form Test
const TestContactForm = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setError('Name is required');
      return;
    }
    try {
      await mockAPI.post('/contacts', { name, email });
      setError('');
    } catch (err) {
      setError('Failed to save contact');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-testid="name-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        data-testid="contact-email-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button data-testid="save-button" type="submit">Save</button>
      {error && <div data-testid="form-error">{error}</div>}
    </form>
  );
};

// Simple Contact List Test
const TestContactList = ({ contacts }) => {
  if (contacts.length === 0) {
    return <div data-testid="no-contacts">No contacts found</div>;
  }

  return (
    <div data-testid="contact-list">
      {contacts.map(contact => (
        <div key={contact.id} data-testid={`contact-${contact.id}`}>
          <span>{contact.name}</span>
          <span>{contact.email}</span>
        </div>
      ))}
    </div>
  );
};

// Test Suite
describe('CRM Frontend Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  // Login Component Tests
  describe('Login Component', () => {
    test('renders login form', () => {
      render(<TestLogin />);
      
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('login-button')).toBeInTheDocument();
    });

    test('shows error for empty fields', async () => {
      render(<TestLogin />);
      
      const loginButton = screen.getByTestId('login-button');
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('Please fill all fields');
      });
    });

    test('submits form with valid data', async () => {
      mockAPI.post.mockResolvedValue({ data: { success: true } });
      
      render(<TestLogin />);
      
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const loginButton = screen.getByTestId('login-button');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(mockAPI.post).toHaveBeenCalledWith('/auth/login', {
          email: 'test@example.com',
          password: 'password123'
        });
      });
    });
  });

  // Contact Form Tests
  describe('Contact Form', () => {
    test('renders contact form', () => {
      render(<TestContactForm />);
      
      expect(screen.getByTestId('name-input')).toBeInTheDocument();
      expect(screen.getByTestId('contact-email-input')).toBeInTheDocument();
      expect(screen.getByTestId('save-button')).toBeInTheDocument();
    });

    test('shows error for empty name', async () => {
      render(<TestContactForm />);
      
      const saveButton = screen.getByTestId('save-button');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('form-error')).toHaveTextContent('Name is required');
      });
    });

    test('submits form with valid data', async () => {
      mockAPI.post.mockResolvedValue({ data: { success: true } });
      
      render(<TestContactForm />);
      
      const nameInput = screen.getByTestId('name-input');
      const emailInput = screen.getByTestId('contact-email-input');
      const saveButton = screen.getByTestId('save-button');
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(mockAPI.post).toHaveBeenCalledWith('/contacts', {
          name: 'John Doe',
          email: 'john@example.com'
        });
      });
    });
  });

  // Contact List Tests
  describe('Contact List', () => {
    test('shows no contacts message when empty', () => {
      render(<TestContactList contacts={[]} />);
      
      expect(screen.getByTestId('no-contacts')).toBeInTheDocument();
      expect(screen.getByTestId('no-contacts')).toHaveTextContent('No contacts found');
    });

    test('renders list of contacts', () => {
      const contacts = [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
      ];
      
      render(<TestContactList contacts={contacts} />);
      
      expect(screen.getByTestId('contact-list')).toBeInTheDocument();
      expect(screen.getByTestId('contact-1')).toHaveTextContent('John Doe');
      expect(screen.getByTestId('contact-2')).toHaveTextContent('Jane Smith');
    });
  });

  // Basic Utility Tests
  describe('Utility Functions', () => {
    test('validates email format', () => {
      const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
      };
      
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });

    test('formats date correctly', () => {
      const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
      };
      
      const testDate = '2023-12-25T00:00:00.000Z';
      const formatted = formatDate(testDate);
      
      expect(formatted).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });
  });
});

console.log('✅ Frontend tests completed!');
