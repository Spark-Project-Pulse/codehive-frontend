'use client'

import FAQ from '@/components/pages/home/FAQ'
import Features from '@/components/pages/home/Features'
import Hero from '@/components/pages/home/Hero'
import Testimonials from '@/components/pages/home/Testimonials'

export default function Home() {
  return (
    <div className="-ml-6 -mr-6 -mt-12">
      <div className="hexagonal-bg">
        <div className="flex min-h-screen flex-col py-12 md:py-24 lg:py-32 xl:py-48">
          <main className="mx-auto max-w-screen-lg flex-grow px-6">
            <Hero />
            <Features />
            <Testimonials />
            <FAQ />
          </main>
        </div>
      </div>
    </div>
  )
}
