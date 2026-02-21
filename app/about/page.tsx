import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ChefHat, Truck, Star, Clock, Shield, Utensils, Heart, Award, Users } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-red-50" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-orange-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-red-100/40 to-transparent rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm animate-fade-in-up">
              <span className="w-2 h-2 bg-food-orange rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-600">About FoodExpress</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Bringing <span className="text-gradient">Deliciousness</span> to Your Door
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              We're passionate about connecting you with the best local chefs and delivering hot, fresh meals right to your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Utensils, value: '500+', label: 'Dishes', color: 'bg-orange-100 text-orange-600' },
              { icon: Star, value: '4.9', label: 'Rating', color: 'bg-red-100 text-red-600' },
              { icon: Truck, value: '30min', label: 'Delivery', color: 'bg-green-100 text-green-600' },
              { icon: Users, value: '10K+', label: 'Customers', color: 'bg-blue-100 text-blue-600' },
            ].map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 text-center shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="group relative bg-white rounded-3xl p-8 lg:p-10 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 animate-fade-in-up">
              <div className="absolute -top-6 left-8 w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold mt-4 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To bring the best local food to your doorstep while supporting local chefs and providing delicious, reliable delivery. We believe everyone deserves access to quality meals, delivered fast and fresh.
              </p>
            </div>
            
            {/* Vision */}
            <div className="group relative bg-white rounded-3xl p-8 lg:p-10 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="absolute -top-6 left-8 w-14 h-14 bg-gradient-to-br from-food-orange to-food-red rounded-2xl flex items-center justify-center shadow-lg">
                <Award className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold mt-4 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To become the most trusted food delivery platform in Ethiopia, connecting food lovers with exceptional local cuisines while empowering local restaurants to grow their reach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-gray-500 max-w-xl mx-auto">We're committed to providing the best food delivery experience</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: 'Fast Delivery',
                description: 'Get your favorite food delivered within 30 minutes. Hot and fresh, right on time.',
                color: 'bg-orange-100 text-orange-600',
              },
              {
                icon: Shield,
                title: 'Safe & Clean',
                description: 'We prioritize hygiene and safety in every step, from kitchen to your doorstep.',
                color: 'bg-green-100 text-green-600',
              },
              {
                icon: Star,
                title: 'Quality Food',
                description: 'Partnered with the best local chefs to bring you diverse, delicious options.',
                color: 'bg-red-100 text-red-600',
              },
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-food-orange/10 to-food-red/10 rounded-3xl p-8 lg:p-12">
              <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  FoodExpress started with a simple idea: make it easy for people to enjoy restaurant-quality meals at home. Founded by a team of food enthusiasts, we saw an opportunity to bridge the gap between local chefs and hungry customers.
                </p>
                <p>
                  What began as a small operation in Addis Ababa has grown into a trusted platform connecting thousands of customers with their favorite local restaurants. We believe in the power of food to bring people together, and we're proud to support our local culinary community.
                </p>
                <p>
                  Today, we continue to innovate and improve our service, always keeping our customers' satisfaction at the heart of everything we do. Thank you for being part of the FoodExpress family!
                </p>
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
                Ready to Order?
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Browse our delicious menu and order your favorite meals today!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/menu">
                  <Button size="xl" variant="secondary" className="bg-white text-food-orange hover:bg-gray-100">
                    View Menu
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

