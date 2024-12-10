import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="w-full mt-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-4">
            <h2 className="text-h3 font-heading leading-tight">
              <span>Welcome to the </span>
              <span className="bg-gradient-to-r from-primary to-tertiary bg-clip-text pr-2 text-transparent">
                CodeHive
              </span>
            </h2>
            <p className="text-p1 mx-auto max-w-[700px] text-muted-foreground md:text-xl font-body">
              Join our thriving developer community where knowledge flows
              freely, projects bloom, and every line of code has a story. Get{' '}
              <strong>tailored feedback</strong>,{' '}
              <strong>share insights</strong>, and <strong>build</strong>{' '}
              something extraordinary.
            </p>

          </div>
          <div className="space-x-4">
            <Link href="/questions/browse">
              <Button variant="outline_main">Browse Questions</Button>
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
