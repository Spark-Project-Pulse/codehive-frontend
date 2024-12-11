import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="w-full mt-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-4">
            <h2 className="text-h7 font-title leading-tight">
              <span>WELCOME TO</span><br />
              <Image
                src="/logo-and-codehive-dark.svg"
                className="mx-auto block dark:hidden"
                alt="CodeHive and its logo"
                width={509}
                height={147}
                onError={(e) => {
                  e.currentTarget.onerror = null
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.innerHTML = 'CodeHive'
                  }
                }}
              />
              <Image
                src="/logo-and-codehive-light.svg"
                className="hidden dark:inline"
                alt="CodeHive and its logo"
                width={509}
                height={147}
                onError={(e) => {
                  e.currentTarget.onerror = null
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.innerHTML = 'CodeHive'
                  }
                }}
              />
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
