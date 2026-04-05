import { Heart, Award, Users, Sparkles } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-display font-bold mb-6 text-center">
          About <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            Mamma&apos;s Ladoo
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 text-center mb-12">
          Bringing traditional sweets and snacks to your doorstep with homemade care
        </p>

        <div className="card p-8 mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Founded in 2024, Mamma&apos;s Ladoo began with one simple idea: share authentic,
            freshly made ladoos and snacks just like home. Every batch is prepared in small
            quantities to keep taste and texture consistently delightful.
          </p>
          <p className="text-gray-600 leading-relaxed">
            From festive gift boxes to daily tea-time snacks, we focus on quality ingredients,
            clean preparation, and reliable delivery. Our goal is to make every bite memorable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="font-bold mb-2">Made with Love</h3>
            <p className="text-sm text-gray-600">Every batch is prepared with homemade attention and care</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-bold mb-2">Premium Quality</h3>
            <p className="text-sm text-gray-600">We source quality ingredients for rich flavor and freshness</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-bold mb-2">Customer First</h3>
            <p className="text-sm text-gray-600">Your satisfaction is always our highest priority</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="font-bold mb-2">Unique Designs</h3>
            <p className="text-sm text-gray-600">Balanced sweetness and authentic regional recipes</p>
          </div>
        </div>

        <div className="card p-8 bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200">
          <h2 className="text-3xl font-bold mb-4 text-center">Our Values</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg mb-1">Quality First</h3>
              <p className="text-gray-600">We never compromise on materials or craftsmanship.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Sustainable Practices</h3>
              <p className="text-gray-600">We're committed to eco-friendly production methods.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Customer Happiness</h3>
              <p className="text-gray-600">Your satisfaction drives everything we do.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
