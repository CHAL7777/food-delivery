import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import FoodList from '@/components/food/FoodList'
import { ArrowRight, Truck, Star, Clock, Shield, Utensils } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-red-50" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-orange-200/50 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-red-100/50 to-transparent rounded-full blur-3xl" />
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 bg-pattern opacity-50" />

        <div className="container mx-auto px-4 relative z-10 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-700">Now delivering in Addis Ababa</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                Fresh meals, <br />
                <span className="text-gradient">fast delivery</span> <br />
                right to your door
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-lg">
                Hand-picked dishes from local chefs. Browse the menu, order in a few taps, and enjoy warm, delicious food delivered quickly.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/menu">
                  <Button size="xl" className="bg-gradient-primary hover:shadow-glow-lg text-white px-8">
                    Order Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/menu">
                  <Button size="xl" variant="outline" className="border-2">
                    Explore Menu
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Utensils className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-sm text-gray-500">Dishes</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">4.9</div>
                    <div className="text-sm text-gray-500">Rating</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Truck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">30min</div>
                    <div className="text-sm text-gray-500">Delivery</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative hidden lg:block animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="relative w-full aspect-square">
                {/* Decorative circles */}
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-300 to-red-400 rounded-[40%_60%_70%_30%/60%_30%_70%_40%] animate-pulse-glow" />
                <div className="absolute inset-4 bg-white rounded-[40%_60%_70%_30%/60%_30%_70%_40%] overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-red-50 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-8xl">🍕</span>
                      <p className="mt-4 text-2xl font-bold text-gray-700">Delicious Food</p>
                      <p className="text-gray-500">Fresh & Hot</p>
                    </div>
                  </div>
                </div>
                
                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 animate-bounce-in">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Safe Delivery</p>
                      <p className="text-xs text-gray-500">Contactless</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 animate-bounce-in" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Fast Delivery</p>
                      <p className="text-xs text-gray-500">Within 30 mins</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Items</h2>
              <p className="text-gray-500">Discover our most popular dishes</p>
            </div>
            <Link href="/menu">
              <Button variant="ghost" className="group">
                View All
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <FoodList limit={6} featured />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Ordering your favorite food has never been easier. Follow these simple steps!</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg z-10">
                1
              </div>
              <div className="bg-white rounded-3xl p-8 pt-16 shadow-card hover:shadow-card-hover transition-all duration-300 group-hover:-translate-y-2">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Utensils className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">Browse Menu</h3>
                <p className="text-gray-500 text-center">Explore our delicious selection of dishes from local favorites to chef specials</p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg z-10">
                2
              </div>
              <div className="bg-white rounded-3xl p-8 pt-16 shadow-card hover:shadow-card-hover transition-all duration-300 group-hover:-translate-y-2">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Truck className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">Place Order</h3>
                <p className="text-gray-500 text-center">Add items to cart and checkout with your preferred payment method</p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative group">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg z-10">
                3
              </div>
              <div className="bg-white rounded-3xl p-8 pt-16 shadow-card hover:shadow-card-hover transition-all duration-300 group-hover:-translate-y-2">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">Enjoy Food</h3>
                <p className="text-gray-500 text-center">Fast delivery to your location. Enjoy your meal hot and fresh!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-food-orange to-food-red rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Hungry? Order Now!
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Get the best local food delivered to your doorstep. Download our app or order online now!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/menu">
                  <Button size="xl" variant="secondary" className="bg-white text-food-orange hover:bg-gray-100">
                    Order Online
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="xl" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
