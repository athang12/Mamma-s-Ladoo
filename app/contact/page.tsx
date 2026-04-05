'use client'

import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Thank you for your message! We will get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-display font-bold mb-6 text-center">
          Get in <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Touch
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 text-center mb-12">
          Have questions? We'd love to hear from you!
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="font-bold mb-2">Email Us</h3>
            <p className="text-gray-600 text-sm">hello@acrylicdecor.com</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-bold mb-2">Call Us</h3>
            <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-bold mb-2">Visit Us</h3>
            <p className="text-gray-600 text-sm">123 Design St, Creative City, CA</p>
          </div>
        </div>

        <div className="card p-8">
          <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Your Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">Subject *</label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="input-field"
                placeholder="How can we help you?"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Message *</label>
              <textarea
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="input-field resize-none"
                placeholder="Tell us more about your inquiry..."
              />
            </div>

            <button type="submit" className="btn-primary flex items-center">
              <Send className="w-5 h-5 mr-2" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
