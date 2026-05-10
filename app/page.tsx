import Hero from '@/components/Hero'
import FeaturedProducts from '@/components/FeaturedProducts'
import Categories from '@/components/Categories'
import Testimonials from '@/components/Testimonials'
import { Leaf, ShieldCheck, Truck, Heart } from 'lucide-react'
import Link from 'next/link'

function WhyChooseUs() {
  const features = [
    {
      icon: <Leaf className="w-6 h-6" />,
      title: '100% Natural',
      desc: 'Pure ingredients with no artificial colors, flavors, or preservatives.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'Quality Assured',
      desc: 'Every batch is freshly prepared and quality checked before packing.',
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: 'Fast Delivery',
      desc: 'Carefully packed and delivered fresh to your doorstep across India.',
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Made with Love',
      desc: 'Traditional recipes passed down through generations of home cooks.',
    },
  ]

  return (
    <section className="py-10 sm:py-14 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-10 md:mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-green-pale text-brand-green text-xs sm:text-sm font-semibold mb-3 tracking-wide uppercase">
            Why Us
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2 sm:mb-3">
            Why Choose Mamma&apos;s Ladoo
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto">
            Mindful choices, flavorful bites, happy tummies.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {features.map((f, i) => (
            <div key={i} className="text-center p-4 sm:p-6 rounded-2xl bg-green-50/60 border border-green-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-brand-green-pale flex items-center justify-center mx-auto mb-3 text-brand-green">
                {f.icon}
              </div>
              <h3 className="font-semibold text-sm sm:text-base mb-1 text-gray-900">{f.title}</h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutStrip() {
  return (
    <section className="bg-brand-green text-white">
      <div className="container mx-auto px-4 py-10 sm:py-14 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 text-sm font-semibold mb-4 tracking-wide">
              Our Story
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-4">
              Know the story of how it all started!
            </h2>
            <p className="text-green-100 text-sm sm:text-base mb-6 leading-relaxed max-w-lg mx-auto md:mx-0">
              Born from a mother&apos;s kitchen, Mamma&apos;s Ladoo brings you the authentic taste of homemade sweets and snacks. Every piece is crafted with love using traditional recipes and the finest ingredients.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center px-6 py-3 bg-white text-brand-green rounded-full font-semibold hover:bg-green-50 transition-colors tap-highlight-transparent"
            >
              About Us
            </Link>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-3">
              <img
                src="/images/Dry_Fruit.jpg"
                alt="Our products"
                className="rounded-2xl w-full h-40 sm:h-48 object-cover shadow-lg"
                loading="lazy"
              />
              <img
                src="/images/Gond.jpg"
                alt="Our kitchen"
                className="rounded-2xl w-full h-40 sm:h-48 object-cover shadow-lg mt-6"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <WhyChooseUs />
      <AboutStrip />
      <Testimonials />
    </>
  )
}
