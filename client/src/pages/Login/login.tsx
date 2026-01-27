import { useState } from 'react'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import logo from '../../assets/images/logo.png'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function redirectByRole(role?: string) {
    if (role === 'INSPECTOR') navigate('/inspections', { replace: true })
    else navigate('/inspections', { replace: true })
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const data = await login(email, password)
      toast.success("Login realizado com sucesso!")
      redirectByRole(data.user.role)
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Falha no login"
      setError(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }


  async function quickLogin(which: 'seller' | 'inspector') {
    const creds =
      which === 'seller'
        ? { email: 'vendedor@teste.com', password: '123456' }
        : { email: 'admin@teste.com', password: '123456' }

    setEmail(creds.email)
    setPassword(creds.password)

    setError(null)
    setIsSubmitting(true)

    try {
      const data = await login(creds.email, creds.password)
      redirectByRole(data.user.role)
      toast.success(
        which === "seller"
          ? "Login como Vendedor realizado!"
          : "Login como Vistoriador realizado!"
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha no login')
      toast.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center space-y-2">
          <img src={logo} alt="EPTA" className="mx-auto h-10" />
          <h1 className="text-xl font-semibold">Bem-vindo</h1>
          <p className="text-sm text-gray-500">
            Insira suas credenciais para acessar o sistema.
          </p>
        </div>

        <form className="space-y-4 text-left" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="email"
                placeholder="seu@email.com"
                className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
              {error}
            </p>
          )}

          <button
            className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'} <ArrowRight size={16} />
          </button>
        </form>

        <div className="pt-4 border-t space-y-3">
          <p className="text-xs text-center text-gray-400">OU TESTE COM</p>

          <button
            type="button"
            className="w-full border rounded-lg p-3 text-left hover:bg-gray-50 disabled:opacity-60"
            onClick={() => quickLogin('seller')}
            disabled={isSubmitting}
          >
            <p className="font-medium">Vendedor</p>
            <p className="text-xs text-gray-500">vendedor@teste.com</p>
          </button>

          <button
            type="button"
            className="w-full border rounded-lg p-3 text-left hover:bg-gray-50 disabled:opacity-60"
            onClick={() => quickLogin('inspector')}
            disabled={isSubmitting}
          >
            <p className="font-medium">Vistoriador</p>
            <p className="text-xs text-gray-500">admin@teste.com</p>
          </button>
        </div>
      </div>
    </div>
  )
}
