"use client"

import Features from "@/components/pages/home/Features";
import Hero from "@/components/pages/home/Hero";

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen py-12 md:py-24 lg:py-32 xl:py-48">
      <main className="flex-grow space-y-12 md:space-y-24 lg:space-y-32">
        <Hero />
        <Features />
        {/* <Testimonials /> */}
        {/* <FAQ /> */}
      </main>
    </div>
  );
}
