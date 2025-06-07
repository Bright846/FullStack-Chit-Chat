import React, { useEffect } from 'react';
import NavBar from './Components/NavBar';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import SignupPage from './Pages/SignupPage';
import ProfilePage from './Pages/ProfilePage';
import SettingsPage from './Pages/SettingsPage';
import { useAuthStore } from './Store/useAuthStore';
import { themeStore } from './Store/useThemeStore';
import { Loader } from "lucide-react";
import { Toaster } from 'react-hot-toast';

const PrivateRoute = ({ children }) => {
  const { authUser } = useAuthStore();
  return authUser ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { authUser } = useAuthStore();
  return !authUser ? children : <Navigate to="/" />;
};

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = themeStore();

  const onlineUsers = useAuthStore(state => state.onlineUsers);
  useEffect(() => {
    console.log("Online users updated:", onlineUsers);
  }, [onlineUsers]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }


  return (
    <div>
      <NavBar />
      <Routes>
        <Route path='/' element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        } />
        <Route path='/signup' element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        } />
        <Route path='/login' element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path='/settings' element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        } />
        <Route path='/profile' element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
