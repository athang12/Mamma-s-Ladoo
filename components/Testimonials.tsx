'use client'

import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Riya Sharma',
    rating: 5,
    comment: 'The besan ladoos tasted exactly like home. Fresh, soft and perfectly sweet.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    tag: 'Verified Buyer',
  },
  {
    name: 'Arjun Mehta',
    rating: 5,
    comment: 'Ordered snacks for office tea-time. Everything arrived crisp and neatly packed.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    tag: 'Repeat Customer',
  },
  {
    name: 'Neha Patel',
    rating: 5,
    comment: 'Great service and quick delivery. The dry fruit ladoos were a family hit.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    tag: 'Verified Buyer',
  },
]

export default function Testimonials() {
  return (
    <section className="py-10 sm:py-14 md:py-20 bg-brand-green-pale/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-10 md:mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white text-brand-green text-xs sm:text-sm font-semibold mb-3 tracking-wide uppercase shadow-sm">
            Reviews
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2 sm:mb-3">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 text-sm sm:text-base md:text-lg">
            Join thousands of happy customers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-5 sm:p-6 relative shadow-md hover:shadow-lg transition-shadow border border-green-100">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-brand-green-pale" />
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4 object-cover"
                  loading="lazy"
                  style={{ border: '2px solid #52b788' }}
                />
                <div>
                  <h4 className="font-semibold text-sm sm:text-base text-gray-900">{testimonial.name}</h4>
                  <div className="flex items-center gap-1.5">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-brand-green font-medium bg-brand-green-pale px-1.5 py-0.5 rounded-full">
                      {testimonial.tag}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                &ldquo;{testimonial.comment}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
