import { Navigate, Route, Routes } from "react-router-dom"
import FloatingShapes from "./components/FloatingShapes"
import SingUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import VerificationEmailPage from "./pages/VerificationEmailPage"
import { Toaster } from "react-hot-toast"
import { useAuthStore } from "./store/AuthStore"
import { useEffect } from "react"
import LoadingSpinner from "./components/LoadingSpinner"
import DashboardPage from "./pages/DashboardPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"


// redirect authenticated user to home page
const RedirectAuthenticatedUser = ({children}) => {
  const { isAuthenticated, user } = useAuthStore()
  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace/>
  }
  return children
}

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />
  }
  return children
}

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore()
  
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth) { 
    return <LoadingSpinner />
  }
  
  return (
    <div className=" min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShapes
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShapes
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShapes
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SingUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/verify-email"
          element={
            <VerificationEmailPage />
          }
        />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App
