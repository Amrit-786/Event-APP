import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import EventList from './pages/EventList';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { getStoredUser, isAdminUser } from './utils/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(localStorage.getItem('token'))
  );
  const [user, setUser] = useState(() => getStoredUser());

  const handleLogin = () => {
    setIsAuthenticated(true);
    setUser(getStoredUser());
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const isAdmin = isAdminUser(user);

  return (
    <Router>
      <Layout
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      >
        <Routes>
          <Route path="/" element={<Home isAdmin={isAdmin} isAuthenticated={isAuthenticated} />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route
            path="/create-event"
            element={
              isAuthenticated && isAdmin ? (
                <CreateEvent />
              ) : isAuthenticated ? (
                <Navigate to="/events" />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/events/:id/edit"
            element={
              isAuthenticated && isAdmin ? (
                <CreateEvent />
              ) : isAuthenticated ? (
                <Navigate to="/events" />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/auth" />}
          />
          <Route
            path="/auth"
            element={
              isAuthenticated ? (
                <Navigate to={isAdmin ? '/create-event' : '/events'} />
              ) : (
                <Auth onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/forgot-password"
            element={
              isAuthenticated ? (
                <Navigate to="/events" />
              ) : (
                <ForgotPassword />
              )
            }
          />
          <Route
            path="/reset-password"
            element={
              isAuthenticated ? (
                <Navigate to="/events" />
              ) : (
                <ResetPassword onLogin={handleLogin} />
              )
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
