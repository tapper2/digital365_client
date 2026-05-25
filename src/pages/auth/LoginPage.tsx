import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { authService } from '../../services/authService'
import { useAuthStore } from '../../store/authStore'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      const { data } = await authService.login(form)
      setAuth(data.user, data.token)
      navigate('/dashboard')
    } catch (err: any) {
      const errs = err?.response?.data?.errors ?? {}
      const msg  = err?.response?.data?.message ?? 'שגיאה בהתחברות'
      setErrors(errs.email ? errs : { email: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">ברוך הבא לDigital365</h1>
          <p className="text-slate-500 mt-1 text-sm">התחבר לחשבונך</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="אימייל"
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              error={errors.email}
              placeholder="you@example.com"
              required
              dir="ltr"
            />
            <Input
              label="סיסמה"
              type="password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              error={errors.password}
              placeholder="••••••••"
              required
              dir="ltr"
            />
            <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
              התחבר
            </Button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-5">
          אין לך חשבון?{' '}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
            הרשם עכשיו
          </Link>
        </p>
      </div>
    </div>
  )
}
