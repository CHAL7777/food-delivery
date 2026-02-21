'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, User, Menu as MenuIcon, X, LogOut, ChefHat, ChevronDown } from 'lucide-react'
import { Button } from './ui/Button'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'

// Type definition for navigation items
interface NavItem {
  name: string
  href: string
  protected?: boolean
}

export default function Navbar() {
  const pathname = usePathname()
  const { getItemCount } = useCartStore()
  const { user, signOut } = useAuthStore()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const navigation: NavItem[] = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Menu', href: '/menu' },
    { name: 'Contact', href: '/contact' },
    { name: 'Orders', href: '/orders', protected: true },
  ]

  const isActive = (path: string) => pathname === path

  const handleSignOut = async () => {
    await signOut()
    setIsUserMenuOpen(false)
    setIsMobileMenuOpen(false)
  }

  // Handle scroll for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Initialize auth state on mount
  useEffect(() => {
    // load user session if available
    ;(async () => {
      try {
        // call initialize from auth store
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const init = await (useAuthStore.getState().initialize?.())
      } catch (e) {
        // ignore init errors
      }
    })()
  }, [])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (isUserMenuOpen && userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isUserMenuOpen])

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.firstName) {
      return `${user.firstName} ${user.lastName || ''}`.trim()
    }
    return user?.email || 'My Account'
  }

  const getUserInitials = () => {
    if (user?.firstName) {
      const first = user.firstName[0] || ''
      const last = user.lastName?.[0] || ''
      return `${first}${last}`.toUpperCase() || 'U'
    }
    return (user?.email?.[0] || 'U').toUpperCase()
  }

  const itemCount = getItemCount()

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-black/5 bg-white/75 shadow-[0_18px_35px_-28px_rgba(0,0,0,0.5)] backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto w-full max-w-[1280px] px-4 md:px-6">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="rounded-2xl bg-gradient-primary p-2.5 shadow-glow transition-transform duration-300 group-hover:scale-105">
              <ChefHat className="h-5 w-5 text-white md:h-6 md:w-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-gradient md:text-2xl">
              FoodExpress
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 rounded-full border border-black/10 bg-white/80 p-1 backdrop-blur lg:flex">
            {navigation.map((item) => {
              if (item.protected && !user) return null
              const active = isActive(item.href)

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-gradient-primary text-white shadow-glow'
                      : 'text-gray-700 hover:bg-orange-50 hover:text-primary'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative rounded-xl border border-black/10 bg-white/80 p-2.5 text-gray-700 backdrop-blur transition-colors hover:bg-orange-50"
              aria-label={`View cart, ${itemCount} items`}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-white shadow-lg">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div ref={userMenuRef} className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-2 rounded-full border border-black/10 bg-white/85 px-2 py-1.5 shadow-sm backdrop-blur transition-colors hover:bg-orange-50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-white">
                    {getUserInitials()}
                  </div>
                  <span className="max-w-28 truncate text-sm font-semibold text-gray-800">
                    {getUserDisplayName()}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Desktop User Dropdown */}
                {isUserMenuOpen && (
                  <div className="surface-panel absolute right-0 mt-3 w-60 animate-scale-in overflow-hidden">
                    <div className="border-b border-black/5 bg-gradient-to-r from-orange-50/90 to-rose-50/70 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-orange-50 hover:text-primary"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="mr-3 h-4 w-4" />
                        Profile Settings
                      </Link>
                      <Link
                        href="/orders"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-orange-50 hover:text-primary"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <ShoppingCart className="mr-3 h-4 w-4" />
                        My Orders
                      </Link>
                    </div>
                    <div className="border-t border-black/5 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center space-x-2 md:flex">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="rounded-full px-5 hover:bg-orange-50">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="rounded-full bg-gradient-primary px-5 text-white hover:shadow-glow">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu toggle button */}
            <button
              className="rounded-xl border border-black/10 bg-white/85 p-2.5 text-gray-700 transition-colors hover:bg-orange-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="animate-slide-in-right border-t border-black/10 py-4 lg:hidden">
            <div className="surface-panel flex flex-col space-y-1 p-2">
              {navigation.map((item) => {
                if (item.protected && !user) return null
                const active = isActive(item.href)

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`rounded-2xl px-4 py-3 font-medium transition-all ${
                      active
                        ? 'bg-gradient-primary text-white shadow-glow'
                        : 'text-gray-700 hover:bg-orange-50 hover:text-primary'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              })}

              {/* Mobile Auth/User section */}
              <div className="mt-2 space-y-2 border-t border-black/10 pt-4">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center rounded-2xl px-4 py-3 text-gray-700 hover:bg-orange-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="mr-3 h-5 w-5" />
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center rounded-2xl px-4 py-3 text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 px-2">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-center rounded-2xl py-6">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full justify-center rounded-2xl bg-gradient-primary py-6">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
