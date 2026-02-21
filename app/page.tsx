import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import FoodList from '@/components/food/FoodList'
import { ArrowRight, Truck, Star, Clock, ShieldCheck, Utensils, Sparkles, HandPlatter } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2rem] bg-pattern px-6 py-12 md:px-10 md:py-16 lg:px-14">
        {/* Background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-100/55 via-white to-rose-100/45" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl" />
        <div className="absolute -right-16 top-0 h-72 w-72 rounded-full bg-rose-300/30 blur-3xl" />

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/70 bg-white/75 px-4 py-2 text-sm font-semibold text-gray-700 backdrop-blur">
              <Sparkles className="h-4 w-4 text-primary" />
              Live delivery now in Addis Ababa
            </div>

            <h1 className="text-4xl font-black leading-tight text-gray-900 md:text-5xl lg:text-6xl">
              Restaurant quality meals,
              <span className="text-gradient"> delivered while still hot.</span>
            </h1>

            <p className="max-w-xl text-lg text-gray-600 md:text-xl">
              Skip long waits and boring menus. Explore curated local favorites, order in seconds, and get fast doorstep delivery with live status updates.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/menu">
                <Button size="xl" className="bg-gradient-primary px-9 text-white hover:shadow-glow-lg">
                  Start Your Order
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="xl" variant="outline" className="border-white bg-white/70 px-9 hover:bg-white">
                  Why FoodExpress
                </Button>
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="surface-panel p-4">
                <p className="text-2xl font-black text-gray-900">500+</p>
                <p className="text-sm text-gray-500">curated dishes</p>
              </div>
              <div className="surface-panel p-4">
                <p className="text-2xl font-black text-gray-900">4.9/5</p>
                <p className="text-sm text-gray-500">customer rating</p>
              </div>
              <div className="surface-panel p-4">
                <p className="text-2xl font-black text-gray-900">30 min</p>
                <p className="text-sm text-gray-500">average delivery</p>
              </div>
            </div>
          </div>

          <div className="surface-panel relative overflow-hidden p-6 animate-fade-in-up md:p-7" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -right-16 -top-20 h-44 w-44 rounded-full bg-orange-200/55 blur-2xl" />
            <div className="relative space-y-5">
              <div className="rounded-2xl bg-gradient-to-br from-orange-100 to-rose-100 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Tonight&apos;s top pick</p>
                    <h3 className="mt-1 text-xl font-black text-gray-900">Flame Grilled Chicken Bowl</h3>
                    <p className="mt-2 text-sm text-gray-500">Spiced rice, roasted vegetables, and chili-lime sauce.</p>
                  </div>
                  <div className="rounded-2xl bg-white px-3 py-2 text-right shadow-sm">
                    <p className="text-xs text-gray-500">from</p>
                    <p className="text-lg font-black text-primary">ETB 390</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-orange-100 bg-white p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Truck className="h-4 w-4 text-primary" />
                    Rider is nearby
                  </div>
                  <p className="text-sm text-gray-500">Current average delivery time for your area is <strong className="text-gray-900">24-32 min</strong>.</p>
                </div>
                <div className="rounded-2xl border border-orange-100 bg-white p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    Safe handoff
                  </div>
                  <p className="text-sm text-gray-500">Contactless drop-off enabled by default for every order.</p>
                </div>
              </div>

              <div className="rounded-2xl bg-gray-900 p-4 text-white">
                <p className="text-xs uppercase tracking-[0.15em] text-white/60">What people say</p>
                <p className="mt-2 text-sm text-white/85">&ldquo;Food arrived hot, packaging was clean, and delivery was way faster than expected.&rdquo;</p>
                <div className="mt-3 flex items-center gap-2 text-orange-300">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu */}
      <section>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Featured menu</p>
            <h2 className="text-3xl font-black text-gray-900">Most loved this week</h2>
            <p className="mt-1 text-gray-500">Top-rated dishes customers keep coming back for.</p>
          </div>
          <Link href="/menu">
            <Button variant="ghost" className="group rounded-full bg-white/70 px-4">
              View All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        <FoodList limit={6} featured />
      </section>

      {/* How It Works */}
      <section className="surface-warm p-7 md:p-10">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">How it works</p>
          <h2 className="text-3xl font-black text-gray-900">From craving to checkout in three steps</h2>
          <p className="mx-auto mt-2 max-w-2xl text-gray-500">Everything is optimized to get food from kitchen to your table quickly and reliably.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="surface-panel group p-6">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-lg font-black text-primary">1</div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
              <Utensils className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-black text-gray-900">Pick your meal</h3>
            <p className="mt-2 text-sm text-gray-500">Explore categories and discover chef-curated dishes with rich details and ratings.</p>
          </div>

          <div className="surface-panel group p-6">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-lg font-black text-rose-600">2</div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50">
              <HandPlatter className="h-7 w-7 text-rose-600" />
            </div>
            <h3 className="text-xl font-black text-gray-900">Confirm instantly</h3>
            <p className="mt-2 text-sm text-gray-500">Add to cart, set delivery details, and complete payment in a frictionless flow.</p>
          </div>

          <div className="surface-panel group p-6">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-lg font-black text-green-600">3</div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
              <Clock className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="text-xl font-black text-gray-900">Track and enjoy</h3>
            <p className="mt-2 text-sm text-gray-500">Follow your order in real time and receive hot meals delivered with care.</p>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="grid gap-4 rounded-3xl bg-gray-900 p-6 text-white md:grid-cols-3 md:p-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-2 inline-flex rounded-lg bg-white/10 p-2">
            <Truck className="h-5 w-5 text-orange-300" />
          </div>
          <h3 className="text-lg font-bold">Fast dispatch</h3>
          <p className="mt-1 text-sm text-white/70">Orders are picked up immediately by nearby riders.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-2 inline-flex rounded-lg bg-white/10 p-2">
            <ShieldCheck className="h-5 w-5 text-orange-300" />
          </div>
          <h3 className="text-lg font-bold">Trusted hygiene</h3>
          <p className="mt-1 text-sm text-white/70">Partner kitchens follow strict prep and packaging standards.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-2 inline-flex rounded-lg bg-white/10 p-2">
            <Star className="h-5 w-5 text-orange-300" />
          </div>
          <h3 className="text-lg font-bold">Loved by locals</h3>
          <p className="mt-1 text-sm text-white/70">Thousands of weekly orders with consistent five-star feedback.</p>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-food-orange to-food-red p-8 text-center md:p-12">
          <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/10" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="text-3xl font-black text-white md:text-4xl">
              Hungry right now?
            </h2>
            <p className="mb-8 mt-3 text-lg text-white/85">
              Open the menu, pick what you love, and let us handle the rest.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/menu">
                <Button size="xl" variant="secondary" className="bg-white text-food-orange hover:bg-orange-50">
                  Browse Menu
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="xl" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                  Contact Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
