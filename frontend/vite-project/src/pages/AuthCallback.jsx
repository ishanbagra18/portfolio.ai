import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { oauthSession } from '../lib/api'
import { setToken } from '../lib/auth'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function handleAuthRedirect() {
      try {
        // Retrieve current session from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          throw new Error(sessionError.message || 'Failed to retrieve OAuth session')
        }

        if (session && session.user) {
          // Exchange Supabase session for backend JWT
          const result = await oauthSession({
            access_token: session.access_token,
            user: {
              id: session.user.id,
              email: session.user.email,
              user_metadata: session.user.user_metadata,
            },
          })

          if (result && result.token) {
            setToken(result.token)
            if (isMounted) {
              navigate('/home', { replace: true })
            }
            return
          }
        }

        // If session not found immediately, set listener for auth state change
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && currentSession) {
            try {
              const res = await oauthSession({
                access_token: currentSession.access_token,
                user: {
                  id: currentSession.user.id,
                  email: currentSession.user.email,
                  user_metadata: currentSession.user.user_metadata,
                },
              })
              if (res && res.token) {
                setToken(res.token)
                if (isMounted) {
                  navigate('/home', { replace: true })
                }
              }
            } catch (err) {
              if (isMounted) setError(err.message || 'OAuth verification failed')
            }
          }
        })

        return () => {
          authListener?.subscription?.unsubscribe()
        }
      } catch (err) {
        console.error('OAuth Callback error:', err)
        if (isMounted) {
          setError(err.message || 'OAuth authentication failed. Please try logging in again.')
        }
      }
    }

    handleAuthRedirect()

    return () => {
      isMounted = false
    }
  }, [navigate])

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-aurora px-4 text-[var(--neo-text)]">
      <div className="glass-panel p-8 max-w-md w-full text-center space-y-6">
        {!error ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-violet-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              Completing Sign In...
            </h2>
            <p className="text-sm text-zinc-400">Verifying your account details</p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto text-xl">
              ✕
            </div>
            <h2 className="text-lg font-bold text-red-400">Authentication Error</h2>
            <p className="text-sm text-zinc-300">{error}</p>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="mt-4 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
