import { Heart, Award, Users, Sparkles } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-display font-bold mb-6 text-center">
          About <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Acrylic & Decor
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 text-center mb-12">
          Creating beautiful, custom acrylic products that bring joy to your space
        </p>

        <div className="card p-8 mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Founded in 2024, Acrylic & Decor started with a simple mission: to make high-quality, 
            customizable acrylic products accessible to everyone. We believe that your space should 
            reflect your personality, and our products help you do just that.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Every piece we create is crafted with precision and care, using premium acrylic materials 
            that are built to last. From custom photo stands to elegant wall frames and charming 
            fridge magnets, we're here to help you personalize your world.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="font-bold mb-2">Made with Love</h3>
            <p className="text-sm text-gray-600">Each product is crafted with care and attention to detail</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-bold mb-2">Premium Quality</h3>
            <p className="text-sm text-gray-600">We use only the finest materials for lasting beauty</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-bold mb-2">Customer First</h3>
            <p className="text-sm text-gray-600">Your satisfaction is our top priority</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="font-bold mb-2">Unique Designs</h3>
            <p className="text-sm text-gray-600">Customize products to match your style</p>
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
