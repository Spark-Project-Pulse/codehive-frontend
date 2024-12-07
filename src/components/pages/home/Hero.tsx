import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="w-full">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-4">
            <h2 className="text-h2 font-bold leading-tight tracking-tighter">
              <span>Welcome to the </span>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text pr-2 text-transparent">
                Hive
              </span>
              <br />
              <span>Where code comes to </span>
              <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text pr-2 text-transparent">
                life
              </span>
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Join our thriving developer community where knowledge flows freely, projects bloom, and every line of code has a story. Get{' '}
              <strong aria-label="Receive tailored feedback">tailored feedback</strong>,{' '}
              <strong aria-label="Share your insights">share insights</strong>, and{' '}
              <strong aria-label="Build amazing things">build</strong> something extraordinary.
            </p>

          </div>
          <div className="space-x-4">
            <Link href="/questions/browse">
              <Button variant="outline">Browse Questions</Button>
            </Link>
            <Link href="/login">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
