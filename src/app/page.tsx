"use client"

import Hero from "@/components/pages/home/Hero";

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Hero />
        {/* <Features />
        <Testimonials />
        <FAQ /> */}
      </main>
    </div>
  );
}
