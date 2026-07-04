import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../lib/api'
import { setToken } from '../lib/auth'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const result = await signup({ name, email, password, confirmPassword })
      setToken(result.token)
      navigate('/home', { replace: true })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-extrabold text-center mb-2 tracking-tight text-white">
        Create <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">Account</span>
      </h2>
      <p className="text-center text-sm text-slate-400 mb-8">Sign up to get started with your profile</p>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-left text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Full Name</label>
          <input 
            className="w-full px-4 py-3 bg-slate-800/40 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200" 
            placeholder="John Doe"
            value={name} 
            onChange={e => setName(e.target.value)} 
            type="text" 
            required 
          />
        </div>

        <div>
          <label className="block text-left text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
          <input 
            className="w-full px-4 py-3 bg-slate-800/40 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200" 
            placeholder="you@example.com"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            type="email" 
            required 
          />
        </div>

        <div>
          <label className="block text-left text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Password</label>
          <input 
            className="w-full px-4 py-3 bg-slate-800/40 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200" 
            placeholder="••••••••"
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            type="password" 
            required 
          />
        </div>

        <div>
          <label className="block text-left text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Confirm Password</label>
          <input 
            className="w-full px-4 py-3 bg-slate-800/40 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200" 
            placeholder="••••••••"
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)} 
            type="password" 
            required 
          />
        </div>

        {error ? (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        ) : null}

        <button 
          disabled={loading} 
          type="submit" 
          className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl transition-all duration-300 transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">
          Sign In
        </Link>
      </p>
    </div>
  )
}
