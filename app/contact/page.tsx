'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Send, MessageSquare } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setSubmitted(true)
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-red-50" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-orange-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-red-100/40 to-transparent rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm animate-fade-in-up">
              <MessageSquare className="w-4 h-4 text-food-orange" />
              <span className="text-sm font-medium text-gray-600">Get in Touch</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Contact <span className="text-gradient">Us</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Info */}
            <div className="space-y-6 animate-fade-in-up">
              <h2 className="text-2xl font-bold">Get in Touch</h2>
              <p className="text-gray-600">
                Feel free to contact us through any of the methods below. We're here to help!
              </p>
              
              <div className="space-y-4">
                {[
                  {
                    icon: Phone,
                    title: 'Phone',
                    details: '+251 911 234 567',
                    subtext: 'Mon - Fri: 9am - 10pm',
                  },
                  {
                    icon: Mail,
                    title: 'Email',
                    details: 'info@foodexpress.com',
                    subtext: 'We reply within 24 hours',
                  },
                  {
                    icon: MapPin,
                    title: 'Address',
                    details: 'Addis Ababa, Ethiopia',
                    subtext: 'Bole Road, Near Airport',
                  },
                  {
                    icon: Clock,
                    title: 'Hours',
                    details: 'Mon - Fri: 9am - 10pm',
                    subtext: 'Sat - Sun: 10am - 11pm',
                  },
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-6 h-6 text-food-orange" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-700 font-medium">{item.details}</p>
                      <p className="text-sm text-gray-500">{item.subtext}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="pt-4">
                <h3 className="font-semibold mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {[
                    { icon: Facebook, label: 'Facebook', color: 'bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white' },
                    { icon: Instagram, label: 'Instagram', color: 'bg-pink-100 text-pink-600 hover:bg-pink-600 hover:text-white' },
                    { icon: Twitter, label: 'Twitter', color: 'bg-sky-100 text-sky-600 hover:bg-sky-600 hover:text-white' },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${social.color}`}
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-gray-500 mb-6">Thank you for reaching out. We'll get back to you soon.</p>
                  <Button onClick={() => setSubmitted(false)} variant="outline">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="How can we help you?"
                      className="flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 focus:border-primary focus:shadow-glow resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required 
                    />
                  </div>
                 
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Send Message
                        <Send className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="pb-16 lg:pb-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-gray-100 to-orange-100 rounded-3xl h-80 lg:h-96 flex items-center justify-center overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-center">
              <MapPin className="w-16 h-16 text-food-orange mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Addis Ababa, Ethiopia</p>
              <p className="text-sm text-gray-500">Map placeholder - Integration available</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-16 lg:pb-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-food-orange to-food-red rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Hungry Now?
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Browse our menu and order your favorite food today!
              </p>
              <Link href="/menu">
                <Button size="xl" variant="secondary" className="bg-white text-food-orange hover:bg-gray-100">
                  View Menu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

