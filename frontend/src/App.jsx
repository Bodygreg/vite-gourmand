import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Pages
import Accueil from './pages/Accueil'
import Menus from './pages/Menus'
import MenuDetail from './pages/MenuDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Commande from './pages/Commande'
import MonEspace from './pages/MonEspace'
import EspaceEmploye from './pages/EspaceEmploye'
import EspaceAdmin from './pages/EspaceAdmin'
import Contact from './pages/Contact'
import ResetPassword from './pages/ResetPassword'
import ForgotPassword from './pages/ForgotPassword'

// Composants
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Route protégée
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, hasRole, loading } = useAuth()

  if (loading) return <div>Chargement...</div>
  if (!isAuthenticated) return <Navigate to="/login" />
  if (roles && !hasRole(roles)) return <Navigate to="/" />

  return children
}

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Accueil />} />
          <Route path="/menus" element={<Menus />} />
          <Route path="/menus/:id" element={<MenuDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Routes utilisateur connecté */}
          <Route path="/commande" element={
            <ProtectedRoute>
              <Commande />
            </ProtectedRoute>
          } />
          <Route path="/mon-espace" element={
            <ProtectedRoute>
              <MonEspace />
            </ProtectedRoute>
          } />

          {/* Routes employé */}
          <Route path="/espace-employe" element={
            <ProtectedRoute roles={['employe', 'administrateur']}>
              <EspaceEmploye />
            </ProtectedRoute>
          } />

          {/* Routes admin */}
          <Route path="/espace-admin" element={
            <ProtectedRoute roles={['administrateur']}>
              <EspaceAdmin />
            </ProtectedRoute>
          } />

          {/* Route 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App