import React from 'react'
import Login from './Pages/Login'
import Services from './Pages/Home'
import TerminalTransfer from './Components/TerminalTransfer'
import Cab from './Pages/Cab'
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './Components/ProtectedRoute'
import Navbar from './Components/Navbar'

const AppRoutes = () => {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <Navigate to="/home" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route 
        path="/login" 
        element={
          isAuthenticated ? (
            <Navigate to="/home" replace />
          ) : (
            <Login />
          )
        } 
      />
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <Services />
            <Navbar />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cab" 
        element={
          <ProtectedRoute>
            <Cab />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App