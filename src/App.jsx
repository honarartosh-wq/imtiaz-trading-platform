import React from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './components/Login'
import ManagerDashboard from './components/dashboards/ManagerDashboard'
import AdminDashboard from './components/dashboards/AdminDashboard'
import ClientDashboard from './components/dashboards/ClientDashboard'

function AppContent() {
  const { user, isManager, isAdmin, isClient } = useAuth();

  if (!user) {
    return <Login />;
  }

  if (isManager) {
    return <ManagerDashboard />;
  }

  if (isAdmin) {
    return <AdminDashboard />;
  }

  if (isClient) {
    return <ClientDashboard />;
  }

  return null;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
