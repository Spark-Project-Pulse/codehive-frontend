'use client'

import FeatureCard from '@/components/pages/login/FeatureCard'
import GithubLoginButton from '@/components/pages/login/GithubLoginButton'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Code, Users, Zap } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="gradient-border">
        <Card className="w-full h-full max-w-md">
          <CardHeader className="text-center">
            <div className="relative mx-auto h-20 w-20">
              <Image
                src="logo.svg"
                alt="CodeHive Logo"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <CardTitle className="text-3xl font-bold">CodeHive</CardTitle>
            <CardDescription>
              Where developers swarm to collaborate!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <GithubLoginButton />
            <p className="text-center text-sm text-muted-foreground">
              Ready to bee part of something amazing? Join the hive!
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 w-full max-w-3xl space-y-8">
        <section>
          <h2 className="mb-4 text-2xl font-bold">
            What&apos;s the buzz about CodeHive?
          </h2>
          <p className="text-muted-foreground">
            CodeHive is the sweetest spot for developers to collaborate, share
            ideas, and build amazing projects together. Just like a hive of
            bees, we thrive on teamwork, innovation, and mutual growth!
          </p>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<Code className="h-8 w-8" />}
            title="Code Together"
            description="Collaborate on projects and get answers to your coding questions, all with the right context and support."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="Connect"
            description="Network with a vibrant community of developers from diverse skill levels and backgrounds."
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8" />}
            title="Learn & Grow"
            description="Engage in discussions, find inspiration from projects, and access curated answers to sharpen your skills."
          />
        </section>
      </div>
    </div>
  )
}
