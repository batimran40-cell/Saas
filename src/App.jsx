import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import ShopsList from './pages/ShopsList.jsx'
import Dashboard from './pages/Dashboard.jsx'
import PublicSite from './pages/PublicSite.jsx'
import RequireAuth from './components/RequireAuth.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <ShopsList />
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard/:shopId"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route path="/site/:slug" element={<PublicSite />} />
    </Routes>
  )
}
