'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, ChefHat, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [recoveryReady, setRecoveryReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasRecoveryHint = useMemo(() => {
    if (typeof window === 'undefined') return false
    const search = new URLSearchParams(window.location.search)
    const hash = window.location.hash
    return (
      search.get('type') === 'recovery' ||
      !!search.get('token_hash') ||
      hash.includes('type=recovery') ||
      hash.includes('access_token=')
    )
  }, [])

  useEffect(() => {
    let mounted = true

    const initializeRecovery = async () => {
      try {
        const search = new URLSearchParams(window.location.search)
        const tokenHash = search.get('token_hash')
        const type = search.get('type')

        if (tokenHash && type === 'recovery') {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            type: 'recovery',
            token_hash: tokenHash
          })

          if (verifyError) {
            if (mounted) {
              setError('This reset link is invalid or expired. Please request a new one.')
              setChecking(false)
            }
            return
          }
        }

        let session = (await supabase.auth.getSession()).data.session

        if (!session && hasRecoveryHint) {
          for (let i = 0; i < 8; i += 1) {
            await sleep(250)
            session = (await supabase.auth.getSession()).data.session
            if (session) break
          }
        }

        if (!mounted) return

        if (session) {
          setRecoveryReady(true)
          setError(null)
        } else {
          setRecoveryReady(false)
          setError('This reset link is invalid or expired. Please request a new one.')
        }
      } catch (_e) {
        if (mounted) {
          setRecoveryReady(false)
          setError('Unable to validate reset link. Please request a new one.')
        }
      } finally {
        if (mounted) setChecking(false)
      }
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return
      if ((event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') && session) {
        setRecoveryReady(true)
        setError(null)
        setChecking(false)
      }
    })

    initializeRecovery()

    return () => {
      mounted = false
      authListener.subscription.unsubscribe()
    }
  }, [hasRecoveryHint])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)

      const { error: updateError } = await supabase.auth.updateUser({
        password
      })

      if (updateError) {
        toast.error(updateError.message || 'Failed to reset password')
        return
      }

      await supabase.auth.signOut()
      toast.success('Password updated successfully. Please login with your new password.')
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-card p-8 text-center max-w-md w-full">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Validating reset link...</p>
        </div>
      </div>
    )
  }

  if (!recoveryReady) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-card p-8 text-center max-w-md w-full">
          <h1 className="text-2xl font-bold mb-3">Reset Link Invalid</h1>
          <p className="text-gray-600 mb-6">{error || 'Please request a new password reset link.'}</p>
          <Link href="/forgot-password">
            <Button className="w-full bg-gradient-primary text-white">Request New Link</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Set New Password</h1>
          <p className="text-gray-500">Enter your new password below.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                  className="pl-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm new password"
                  className="pl-12"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:shadow-glow"
              size="lg"
              disabled={loading}
            >
              {loading ? 'Updating Password...' : 'Update Password'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
