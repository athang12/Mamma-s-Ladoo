'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CustomizePageDisabled() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/products')
    }, 2500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">Customization Is Disabled</h1>
      <p className="text-gray-600 mb-8">
        This store now focuses on ready-to-order ladoos and snacks.
        Redirecting you to the products page.
      </p>
      <button
        onClick={() => router.push('/products')}
        className="btn-primary"
      >
        Go to Products
      </button>
    </div>
  )
}
