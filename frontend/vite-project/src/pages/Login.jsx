import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login, verifyOTP } from '../lib/api'
import { setToken } from '../lib/auth'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1) // 1: Login, 2: OTP
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login({ email, password })
      if (result.requires2FA) {
        setStep(2)
      } else {
        setToken(result.token)
        navigate('/home', { replace: true })
      }
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await verifyOTP({ email, otp })
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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      className="flex flex-col w-full"
    >
      <h2 className="text-3xl font-display font-extrabold text-center mb-2 tracking-tight text-[var(--neo-text)]">
        Welcome <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">Back</span>
      </h2>
      <p className="text-center text-sm text-[var(--neo-text)]/60 mb-8 font-sans">Sign in to manage your profile</p>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.form 
            key="login-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleLogin} 
            className="space-y-6"
          >
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
className="w-full mt-2 bg-gradient-to-r from-pink-500 via-purple-600 to-violet-600 hover:from-pink-600 hover:via-purple-700 hover:to-violet-700 transition-all duration-300"            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </motion.form>
        ) : (

          <motion.form 
            key="otp-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleVerify} 
            className="space-y-6"
          >
            <div className="p-4 bg-[var(--neo-bg)]/50 border border-zinc-700/50 rounded-xl mb-4 text-center">
              <p className="text-sm text-zinc-300">We've sent a 6-digit code to</p>
              <p className="font-bold text-accent-color">{email}</p>
            </div>
            
            <Input 
              label="Authentication Code"
              placeholder="123456"
              value={otp} 
              onChange={e => setOtp(e.target.value)} 
              type="text"
              maxLength={6}
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
              className="w-full mt-2 hover:bg-pink-500 transition-colors "
            >
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </Button>

            <button 
              type="button" 
              onClick={() => { setStep(1); setError(''); }}
              className="w-full text-xs text-zinc-400 hover:text-[var(--neo-text)] mt-4 transition-colors "
            >
              Back to Login
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {step === 1 && (
        <p className="mt-6 text-center text-sm text-[var(--neo-text)]/60">
          Don't have an account?{' '}
          <Link to="/register" className="text-violet-400 font-semibold hover:text-pink-300  transition-colors">
            Sign Up
          </Link>
        </p>
      )}
    </motion.div>
  )
}
