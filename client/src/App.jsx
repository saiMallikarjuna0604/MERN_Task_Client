import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';

const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Activities = lazy(() => import('./pages/Activities.jsx'));

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Navbar />
                <Suspense fallback={
                  <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading dashboard...</p>
                  </div>
                }>
                  <Dashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/activities"
            element={
              <ProtectedRoute>
                <Navbar />
                <Suspense fallback={
                  <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading activities...</p>
                  </div>
                }>
                  <Activities />
                </Suspense>
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <h1>404 - Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
