'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, User, Menu as MenuIcon, X, LogOut, ChefHat } from 'lucide-react'
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

  const navigation: NavItem[] = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Menu', href: '/menu' },
    { name: 'Contact', href: '/contact' },
    { name: 'Orders', href: '/orders', protected: true },
  ]

  const isActive = (path: string) => pathname === path

  const handleSignOut = () => {
    signOut()
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

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.firstName) {
      return `${user.firstName} ${user.lastName || ''}`.trim()
    }
    return user?.email || 'My Account'
  }

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass shadow-lg bg-white/90' 
          : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-primary p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">
              FoodExpress
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              if (item.protected && !user) return null
              const active = isActive(item.href)
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Cart */}
            <Link 
              href="/cart" 
              className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label={`View cart, ${getItemCount()} items`}
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                  {getItemCount()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative hidden md:block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </Button>
                
                {/* Desktop User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 animate-scale-in overflow-hidden">
                    <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-primary"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile Settings
                      </Link>
                      <Link
                        href="/orders"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-primary"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-3" />
                        My Orders
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="hover:bg-orange-50">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-gradient-primary hover:shadow-glow text-white">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu toggle button */}
            <button
              className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 animate-slide-in-right">
            <div className="flex flex-col space-y-1">
              {navigation.map((item) => {
                if (item.protected && !user) return null
                const active = isActive(item.href)
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`px-4 py-3 rounded-xl font-medium transition-all ${
                      active
                        ? 'bg-gradient-to-r from-orange-50 to-red-50 text-primary'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              })}
              
              {/* Mobile Auth/User section */}
              <div className="pt-4 mt-2 border-t border-gray-100 space-y-2">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5 mr-3" />
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 px-2">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-center py-6">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full justify-center py-6 bg-gradient-primary">
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

