import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../lib/api'
import { setToken } from '../lib/auth'
import { motion } from 'framer-motion'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

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
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      className="flex flex-col w-full"
    >
      <h2 className="text-3xl font-display font-extrabold text-center mb-2 tracking-tight text-[var(--neo-text)]">
        Create <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">Account</span>
      </h2>
      <p className="text-center text-sm text-[var(--neo-text)]/60 mb-8 font-sans">Sign up to get started with your profile</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Full Name"
          placeholder="John Doe"
          value={name}
          onChange={e => setName(e.target.value)}
          type="text"
          required
        />

        <Input
          label="Email Address"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          required
        />

        <Input
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          required
        />

        <Input
          label="Confirm Password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          type="password"
          required
        />

        {error ? (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        ) : null}

        <Button
          disabled={loading}
          type="submit"
          variant="primary"
className="w-full mt-2 bg-gradient-to-r from-pink-500 via-purple-600 to-violet-600 hover:from-pink-600 hover:via-purple-700 hover:to-violet-700 transition-all duration-300"        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>  


      <p className="mt-6 text-center text-sm text-[var(--neo-text)]/60">
        Already have an account?{' '}
        <Link to="/login" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">
          Sign In
        </Link>
      </p>
    </motion.div>
  )
}
