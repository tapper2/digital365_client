import { LogOut, Zap, User } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/authService'
import { useNavigate } from 'react-router-dom'

export function Navbar() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try { await authService.logout() } catch {}
    clearAuth()
    navigate('/login')
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-slate-900 text-lg tracking-tight">Digital365</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
          <User className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-600">{user?.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          title="התנתק"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
