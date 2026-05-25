import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { authService } from '../../services/authService'
import { useAuthStore } from '../../store/authStore'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      const { data } = await authService.register(form)
      setAuth(data.user, data.token)
      navigate('/dashboard')
    } catch (err: any) {
      const errs = err?.response?.data?.errors ?? {}
      setErrors(Object.fromEntries(Object.entries(errs).map(([k, v]) => [k, (v as string[])[0]])))
    } finally {
      setLoading(false)
    }
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }))

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">צור חשבון Digital365</h1>
          <p className="text-slate-500 mt-1 text-sm">הצטרף ובנה דפי נחיתה עם AI</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="שם מלא" value={form.name} onChange={set('name')} error={errors.name} placeholder="ישראל ישראלי" required />
            <Input label="אימייל" type="email" value={form.email} onChange={set('email')} error={errors.email} placeholder="you@example.com" required dir="ltr" />
            <Input label="סיסמה" type="password" value={form.password} onChange={set('password')} error={errors.password} placeholder="מינימום 8 תווים" required dir="ltr" />
            <Input label="אימות סיסמה" type="password" value={form.password_confirmation} onChange={set('password_confirmation')} error={errors.password_confirmation} placeholder="חזור על הסיסמה" required dir="ltr" />
            <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
              צור חשבון
            </Button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-5">
          כבר יש לך חשבון?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            התחבר
          </Link>
        </p>
      </div>
    </div>
  )
}
