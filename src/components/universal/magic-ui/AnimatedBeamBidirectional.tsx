'use client'

import React, { forwardRef, useRef } from 'react'

import { cn } from '@/lib/utils'
import { AnimatedBeam } from '@/components/ui/animated-beam'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import Image from 'next/image'

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'z-10 flex size-12 items-center justify-center rounded-full border-2 bg-background p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]',
        className
      )}
    >
      {children}
    </div>
  )
})

Circle.displayName = 'Circle'

export function AnimatedBeamBidirectional({
  className,
}: {
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const div1Ref = useRef<HTMLDivElement>(null)
  const div2Ref = useRef<HTMLDivElement>(null)

  return (
    <div
      className={cn('relative flex items-center justify-center', className)}
      ref={containerRef}
    >
      <div className="flex size-full flex-col items-stretch justify-between gap-10">
        <div className="flex flex-row justify-between">
          <Circle ref={div1Ref}>
            <Icons.user />
          </Circle>
          <Circle ref={div2Ref}>
            <Icons.openai />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div2Ref}
        startYOffset={10}
        endYOffset={10}
        curvature={-20}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div2Ref}
        startYOffset={-10}
        endYOffset={-10}
        curvature={20}
        reverse
      />
    </div>
  )
}

const Icons = {
  openai: GitHubLogoIcon,
  user: () => (
    <>
      <Image
        src="/logo.svg"
        alt="Github logo"
        width={20}
        height={20}
        className="h-5 w-5"
      />

      {/* TODO: replace the above with the following light/dark implementation */}
      {/* <Image
        src="/logo.svg"
        alt="Github logo"
        width={20}
        height={20}
        className="h-5 w-5 dark:hidden"
      />
      <Image
        src="/logo-dark.svg"
        alt="Github logo"
        width={20}
        height={20}
        className="hidden h-5 w-5 dark:block"
      /> */}
    </>
  ),
}
