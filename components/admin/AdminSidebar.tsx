'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, PlusSquare, ChefHat } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/foods', label: 'Foods', icon: UtensilsCrossed },
  { href: '/admin/foods/add', label: 'Add Food', icon: PlusSquare }
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="surface-panel h-full p-4 md:p-5">
      <Link href="/admin" className="mb-6 flex items-center gap-3 rounded-2xl bg-gradient-primary px-4 py-3 text-white shadow-glow">
        <ChefHat className="h-5 w-5" />
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-white/80">Admin</p>
          <p className="text-sm font-bold leading-none">FoodExpress</p>
        </div>
      </Link>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition-all ${
                active
                  ? 'bg-gradient-primary text-white shadow-glow'
                  : 'text-gray-700 hover:bg-orange-50 hover:text-primary'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
