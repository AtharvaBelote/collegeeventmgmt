import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Public pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Protected pages
import Dashboard from '../pages/Dashboard';
import Events from '../pages/Events';
import EventDetails from '../pages/EventDetails';
import CreateEvent from '../pages/admin/CreateEvent';
import EditEvent from '../pages/admin/EditEvent';
import UserManagement from '../pages/admin/UserManagement';
import EventManagement from '../pages/admin/EventManagement';
import Profile from '../pages/Profile';
import MyEvents from '../pages/MyEvents';

// Layout components
import Layout from '../components/layout/Layout';
import AdminLayout from '../components/layout/AdminLayout';

// Protected Route component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Role-based route wrapper
const RoleRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetails />} />
        <Route path="my-events" element={<MyEvents />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="events" element={<EventManagement />} />
        <Route path="events/create" element={<CreateEvent />} />
        <Route path="events/:id/edit" element={<EditEvent />} />
      </Route>

      {/* Faculty Routes */}
      <Route
        path="/faculty"
        element={
          <ProtectedRoute requiredRole="FACULTY">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/faculty/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetails />} />
        <Route path="events/create" element={<CreateEvent />} />
        <Route path="my-events" element={<MyEvents />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute requiredRole="STUDENT">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetails />} />
        <Route path="my-events" element={<MyEvents />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;





