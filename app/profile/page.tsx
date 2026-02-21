'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { KeyRound, Mail, ShieldCheck, UserCircle2, RefreshCcw, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

type ProfileResponse = {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  phone: string | null
  role: 'user' | 'admin'
  avatar: string | null
  createdAt: string
  updatedAt: string
}

type ProfileForm = {
  firstName: string
  lastName: string
  phone: string
  avatar: string
}

const initialForm: ProfileForm = {
  firstName: '',
  lastName: '',
  phone: '',
  avatar: ''
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading: authLoading, initialize, setUser, signOut } = useAuthStore()

  const [loadingProfile, setLoadingProfile] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sendingReset, setSendingReset] = useState(false)
  const [formData, setFormData] = useState<ProfileForm>(initialForm)
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null)

  useEffect(() => {
    initialize()
  }, [initialize])

  const getAuthHeaders = async () => {
    const { data } = await supabase.auth.getSession()
    const accessToken = data.session?.access_token
    const headers: Record<string, string> = {}
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }
    return headers
  }

  const syncAuthStore = (profile: ProfileResponse) => {
    if (!user) return
    setUser({
      ...user,
      email: profile.email,
      firstName: profile.firstName || undefined,
      lastName: profile.lastName || undefined,
      phone: profile.phone || undefined,
      avatar: profile.avatar || undefined,
      role: profile.role,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt
    })
  }

  const fetchProfile = async () => {
    if (!user) return

    try {
      setLoadingProfile(true)
      const headers = await getAuthHeaders()
      const response = await fetch('/api/profiles', {
        headers,
        cache: 'no-store'
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.error || 'Failed to load profile')
      }

      const profile = (await response.json()) as ProfileResponse
      setProfileData(profile)
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        avatar: profile.avatar || ''
      })
      syncAuthStore(profile)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load profile')
    } finally {
      setLoadingProfile(false)
    }
  }

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setLoadingProfile(false)
      return
    }

    fetchProfile()
  }, [authLoading, user?.id])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!user) return

    try {
      setSaving(true)
      const headers = await getAuthHeaders()
      const response = await fetch('/api/profiles', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.error || 'Failed to save profile')
      }

      const profile = (await response.json()) as ProfileResponse
      setProfileData(profile)
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        avatar: profile.avatar || ''
      })
      syncAuthStore(profile)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleSendResetEmail = async () => {
    if (!user?.email) return

    try {
      setSendingReset(true)
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        throw new Error(error.message || 'Failed to send password reset email')
      }

      toast.success('Password reset link sent to your email')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send reset link')
    } finally {
      setSendingReset(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out')
    router.push('/login')
  }

  if (authLoading || loadingProfile) {
    return (
      <div className="surface-panel flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h2 className="text-2xl font-black mb-2">Please Login</h2>
        <p className="text-gray-600 mb-6">Sign in to manage your profile settings.</p>
        <Link href="/login?redirect=/profile">
          <Button className="bg-gradient-primary text-white">Go to Login</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="surface-warm p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Profile Settings</h1>
            <p className="mt-2 text-gray-600">Manage your personal account information.</p>
          </div>
          <Button variant="outline" onClick={fetchProfile}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="surface-panel p-6 lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">First name</label>
                <Input
                  value={formData.firstName}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, firstName: event.target.value }))
                  }
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Last name</label>
                <Input
                  value={formData.lastName}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, lastName: event.target.value }))
                  }
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Phone</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, phone: event.target.value }))
                }
                placeholder="+251 9xx xxx xxx"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Avatar URL</label>
              <Input
                type="url"
                value={formData.avatar}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, avatar: event.target.value }))
                }
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={saving} className="bg-gradient-primary text-white">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </section>

        <section className="space-y-6">
          <div className="surface-panel p-6">
            <div className="mb-4 flex items-center gap-2">
              <UserCircle2 className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-black text-gray-900">Account</h2>
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2 text-gray-700">
                <Mail className="h-4 w-4 text-gray-400" />
                {profileData?.email || user.email}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <ShieldCheck className="h-4 w-4 text-gray-400" />
                Role:{' '}
                <span className="font-semibold capitalize">
                  {profileData?.role || user.role}
                </span>
              </p>
              <p className="text-xs text-gray-500">
                Last updated:{' '}
                {profileData?.updatedAt
                  ? new Date(profileData.updatedAt).toLocaleString()
                  : 'N/A'}
              </p>
            </div>
          </div>

          <div className="surface-panel p-6">
            <div className="mb-4 flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-black text-gray-900">Security</h2>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-center"
                onClick={handleSendResetEmail}
                disabled={sendingReset}
              >
                {sendingReset ? 'Sending...' : 'Send Password Reset Link'}
              </Button>

              <Button
                type="button"
                variant="destructive"
                className="w-full justify-center"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
