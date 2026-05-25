import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import LoginPage    from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import BuilderPage  from './pages/builder/BuilderPage'
import EditorPage   from './pages/editor/EditorPage'
import LeadsPage    from './pages/leads/LeadsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public auth routes */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected app routes */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard"       element={<DashboardPage />} />
          <Route path="/builder"         element={<BuilderPage />} />
          <Route path="/editor/:id"      element={<EditorPage />} />
          <Route path="/leads/:id"       element={<LeadsPage />} />
        </Route>

        {/* Default redirect */}
        <Route path="/"   element={<Navigate to="/dashboard" replace />} />
        <Route path="*"   element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
