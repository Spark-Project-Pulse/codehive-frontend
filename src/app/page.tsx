"use client"

import FAQ from "@/components/pages/home/FAQ";
import Features from "@/components/pages/home/Features";
import Hero from "@/components/pages/home/Hero";
import Testimonials from "@/components/pages/home/Testimonials";
import HomeLayout from "@/components/universal/home-layout";

export default function Home() {

  return (
    <HomeLayout>
      <div className="hexagonal-bg">
        <div className="flex flex-col min-h-screen py-12 md:py-24 lg:py-32 xl:py-48">

          <main className="flex-grow max-w-screen-lg mx-auto px-6">
            <Hero />
            <Features />
            <Testimonials />
            <FAQ />
          </main>
        </div>
      </div>
    </HomeLayout>
  );
}
