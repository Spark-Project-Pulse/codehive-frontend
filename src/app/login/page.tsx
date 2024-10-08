'use client'

import GithubLoginButton from '@/components/login/GithubLoginButton'

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <GithubLoginButton />
    </div>
  )
}