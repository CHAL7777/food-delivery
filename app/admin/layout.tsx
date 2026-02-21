'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h2 className="text-2xl font-black mb-2">Admin Access Required</h2>
        <p className="text-gray-600 mb-6">Please sign in with an admin account to continue.</p>
        <Link href="/login?redirect=/admin">
          <Button className="bg-gradient-primary text-white">Go to Login</Button>
        </Link>
      </div>
    )
  }

  if (user.role !== 'admin') {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-black mb-2">Forbidden</h2>
        <p className="text-gray-600 mb-6">Your account is not an admin account.</p>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
        <AdminSidebar />
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
