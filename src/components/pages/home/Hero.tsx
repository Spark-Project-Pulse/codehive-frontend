import React from 'react';
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-4">
            <h2 className="text-h2 font-bold tracking-tighter leading-tight">
              <span>Welcome to the{' '}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary pr-2">
                Hive
              </span>
              <br />
              <span>Where code comes to{' '}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary pr-2">
                life
              </span>
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Join our thriving developer community where knowledge flows freely, 
              projects bloom, and every line of code has a story. Get real-time feedback, 
              share insights, and build something extraordinary.
            </p>
          </div>
          <div className="space-x-4">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Start Collaborating
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-secondary/50">
              Explore Projects
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}