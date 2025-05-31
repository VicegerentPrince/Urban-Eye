import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CitizenDashboard from './pages/CitizenDashboard';
import AdminDashboard from './pages/AdminDashboard';
import OfficialDashboard from './pages/OfficialDashboard';
import ReportIssue from './pages/ReportIssue';
import MapView from './pages/MapView';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminSettings from './pages/AdminSettings';
import CitizenSettings from './pages/CitizenSettings';
import { authService } from './services/api';

// Protected route component
const ProtectedRoute = ({ children, userType }) => {
  const user = authService.getCurrentUser();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (userType && user.userType !== userType) {
    // Redirect to appropriate dashboard based on user type
    switch(user.userType) {
      case 'admin':
        return <Navigate to="/admin" />;
      case 'official':
        return <Navigate to="/official" />;
      default:
        return <Navigate to="/citizen" />;
    }
  }
  
  // If children is a function, pass the user to it
  if (typeof children === 'function') {
    return children({ user });
  }
  
  // Otherwise, just render the children
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="citizen" element={
            <ProtectedRoute userType="citizen">
              <CitizenDashboard />
            </ProtectedRoute>
          } />
          <Route path="admin" element={
            <ProtectedRoute userType="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="official" element={
            <ProtectedRoute userType="official">
              <OfficialDashboard />
            </ProtectedRoute>
          } />
          <Route path="report" element={
            <ProtectedRoute>
              <ReportIssue />
            </ProtectedRoute>
          } />
          <Route path="map" element={
            <ProtectedRoute>
              <MapView />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="settings" element={
            <ProtectedRoute>
              {({ user }) => (
                user.userType === 'admin' ? <AdminSettings /> : <CitizenSettings />
              )}
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;