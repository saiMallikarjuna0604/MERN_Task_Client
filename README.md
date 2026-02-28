# CRM Application - MERN Stack

A full-stack Customer Relationship Management (CRM) application built with MERN (MongoDB, Express, React, Node.js). Track contacts, manage their information, and maintain a complete activity log of all changes.

## 📋 Features

- **User Authentication**: Signup and login with JWT tokens and refresh token rotation
- **Contact Management**: Create, read, update, and delete contacts with detailed information
- **Search & Filter**: Real-time search by name, email, company with debounced API calls
- **Status Tracking**: Manage contact status (Lead, Prospect, Customer)
- **Activity Logs**: Complete audit trail of all actions (create, update, delete) with timestamps in milliseconds
- **CSV Export**: Export all contacts to CSV format
- **Responsive Design**: Mobile-friendly interface with optimized layout
- **Pagination**: Infinite scroll with load more functionality

## 🛠️ Tech Stack

### Frontend

- **React** - UI library
- **Vite** - Build tool and development server
- **JavaScript (ES6+)** - Language

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication (jsonwebtoken)
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
Task_MERN/
├── client/                      # React frontend
│   ├── src/
│   │   ├── actions/             # API call functions
│   │   │   ├── activityActions.js
│   │   │   ├── authActions.js
│   │   │   └── contactActions.js
│   │   ├── components/          # Reusable components
│   │   │   ├── ContactForm.jsx
│   │   │   ├── ContactList.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Signup.jsx
│   │   ├── hooks/               # Custom React hooks
│   │   │   └── useDebounce.jsx
│   │   ├── pages/               # Page components
│   │   │   ├── Activities.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── server/                      # Node.js backend
│   ├── controllers/             # Request handlers
│   │   ├── activityController.js
│   │   ├── authController.js
│   │   └── contactController.js
│   ├── models/                  # Mongoose schemas
│   │   ├── Activity.js
│   │   ├── Contact.js
│   │   └── User.js
│   ├── routes/                  # API routes
│   │   ├── activities.js
│   │   ├── auth.js
│   │   └── contacts.js
│   ├── middleware/              # Custom middleware
│   │   ├── auth.js
│   │   └── validation.js
│   ├── utils/                   # Utility functions
│   │   └── jwt.js
│   ├── server.js                # Express app entry point
│   ├── package.json
│   └── .env
│
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas URI)
- npm or yarn

### Installation

#### 1. Clone the repository

```bash
git clone <repository-url>
cd Task_MERN
```

#### 2. Setup Server

```bash
cd server
npm install
```

Create a `.env` file in the server directory:

```
MONGODB_URI=mongodb://localhost:27017/crm-app
JWT_SECRET=your-secret-key-here
REFRESH_TOKEN_SECRET=your-refresh-secret-here
PORT=5000
```

#### 3. Setup Client

```bash
cd ../client
npm install
```

Create a `.env` file in the client directory:

```
VITE_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Start the Server

```bash
cd server
npm start
```

Server runs on `http://localhost:5000`

### Start the Client

In a new terminal:

```bash
cd client
npm run dev
```

Client runs on `http://localhost:5173` (or as shown in terminal)

## 📡 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile (protected)

### Contacts

- `GET /api/contacts` - Get all contacts (with pagination, search, filter)
- `POST /api/contacts` - Create new contact
- `GET /api/contacts/:id` - Get single contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact
- `GET /api/contacts/export` - Export contacts to CSV

### Activities

- `GET /api/activities` - Get activity logs (with pagination, action filter)

## 📊 Database Schema

### User Model

```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  refreshTokens: [{
    token: String,
    createdAt: Number (milliseconds)
  }],
  createdAt: Number (milliseconds),
  updatedAt: Number (milliseconds)
}
```

### Contact Model

```javascript
{
  name: String (required),
  email: String,
  phone: String,
  company: String,
  status: String (enum: ['Lead', 'Prospect', 'Customer']),
  notes: String,
  createdBy: ObjectId (ref: User),
  createdAt: Number (milliseconds),
  updatedAt: Number (milliseconds)
}
```

### Activity Model

```javascript
{
  action: String (enum: ['create', 'update', 'delete']),
  resourceType: String (enum: ['contact']),
  resourceId: ObjectId,
  resourceName: String,
  userId: ObjectId (ref: User),
  details: Mixed (object with action-specific data),
  createdAt: Number (milliseconds),
  updatedAt: Number (milliseconds)
}
```

## 🔐 Authentication Flow

1. User signs up with username, email, and password
2. Password is hashed with bcryptjs (12 salt rounds)
3. On login, user receives:
   - `accessToken` - Short-lived JWT (15 minutes)
   - `refreshToken` - Long-lived token stored in DB
4. Access token used for protected routes via Bearer token
5. When access token expires, refresh token renews it
6. On logout, refresh token is removed from database

## 🔍 Key Features Implementation

### Debounced Search

- Search input uses `useDebounce` hook with 500ms delay
- API calls triggered only on debounced value change
- Prevents excessive API requests while typing

### Activity Logging

- Every contact action (create/update/delete) is logged
- Deleted contacts stored in activity details for audit trail
- Timestamps stored in milliseconds for precision

### Pagination

- Infinite scroll with "Load More" button
- Separate limit per resource (20 for activities, 10 for contacts)
- Client-side concatenation of pages

### Protected Routes

- `ProtectedRoute` component wraps authenticated pages
- Redirects to login if no access token
- Validates authentication state

## 📝 Notes

- All timestamps are stored as **Numbers (milliseconds)** for consistency
- IDs use MongoDB ObjectId format, can match strings automatically
- Refresh tokens are limited to 5 per user, oldest removed on new login
- Search is case-insensitive regex across name, email, company fields
- CSV export includes formatted date fields

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available under the MIT License.
