import Link from 'next/link'
import { ChefHat, Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, ArrowUpRight } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer aria-label="Site Footer" className="relative mt-auto overflow-hidden bg-gradient-dark text-white">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary" />
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-food-orange/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-food-red/10 rounded-full blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 py-14 md:px-6">
        <div className="mb-10 surface-panel border-white/15 bg-white/5 p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-200">Ready to order</p>
              <h3 className="text-2xl font-bold text-white md:text-3xl">Get your favorite dishes delivered in minutes</h3>
              <p className="mt-2 text-sm text-white/70 md:text-base">Fresh meals, reliable delivery, and a checkout flow built for speed.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-orange-50"
              >
                Start ordering
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-white/35 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Talk to support
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-gradient-primary p-2 rounded-xl">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">
                FoodExpress
              </span>
            </Link>
            <p className="leading-relaxed text-gray-300">
              Delivering delicious meals from the best local restaurants directly to your doorstep. Fresh, hot, and on time!
            </p>
            <div className="flex gap-4">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-primary rounded-full" />
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/about" 
                  className="flex items-center gap-2 text-gray-300 transition-colors duration-300 hover:text-primary"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/menu" 
                  className="flex items-center gap-2 text-gray-300 transition-colors duration-300 hover:text-primary"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Our Menu
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="flex items-center gap-2 text-gray-300 transition-colors duration-300 hover:text-primary"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href="/orders" 
                  className="flex items-center gap-2 text-gray-300 transition-colors duration-300 hover:text-primary"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Track Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Contact Us
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-primary rounded-full" />
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-300">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span>+251 911 234 567</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span>info@foodexpress.com</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p>Mon - Fri: 9am - 10pm</p>
                  <p>Sat - Sun: 10am - 11pm</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Newsletter
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-primary rounded-full" />
            </h3>
            <p className="mb-4 text-gray-300">
              Subscribe to get special offers and updates!
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 focus:border-primary focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-primary px-4 py-3 font-semibold text-white transition-all duration-300 hover:shadow-glow"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-8 text-center md:flex-row md:text-left">
          <p className="text-sm text-gray-300">
            &copy; {currentYear} FoodExpress. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-300">
            <Link href="/privacy" className="transition-colors hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="transition-colors hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
