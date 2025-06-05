import Login from './Pages/Login'
import Services from './Pages/Home'
import Cab from './Pages/Cab'
import CabSearchResults from './Pages/Cab/CabSearchResults'
import TransferBookingReview from './Pages/Cab/TransferBookingReview'
import HourlyRentalReview from './Pages/Cab/HourlyRentalReview'
import MultidayRentalReview from './Pages/Cab/MultidayRentalReview'
import CabBookingConfirmation from './Pages/Cab/CabBookingConfirmation'
import { Route, Routes, BrowserRouter as Router, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './Components/ProtectedRoute'
import Navbar from './Components/Navbar'

const ReviewBooking = () => {
  const location = useLocation();
  const { bookingDetails, type, userInput } = location.state || {};
  
  switch (type) {
    case 'city':
    case 'terminal':
      return <TransferBookingReview />;
    case 'hourly':
      return <HourlyRentalReview />;
    case 'multiday':
      return <MultidayRentalReview bookingDetails={bookingDetails} userInput={userInput} />;
    default:
      return <Navigate to="/cab" replace />;
  }
};

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
            <Navbar />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cab/search-results" 
        element={
          <ProtectedRoute>
            <CabSearchResults />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cab/review" 
        element={
          <ProtectedRoute>
            <ReviewBooking />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cab/confirmation" 
        element={
          <ProtectedRoute>
            <CabBookingConfirmation />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App