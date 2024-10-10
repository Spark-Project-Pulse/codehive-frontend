"use client";

import { signOutAction } from '@/api/auth'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from '../ui/use-toast'
import { Button } from '../ui/button'

export default function SignOutButton() {
  const router = useRouter()
  const [isPending, startTransaction] = useTransition()

  const handleClickSignoutButton = () => {
    startTransaction(async () => {
      const { errorMessage } = await signOutAction()
      if (!errorMessage) {
        toast({
          title: 'Success!',
          description: 'Signed out succesfully',
        })

        router.push('/')
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMessage,
        })
      }
    })
  }

  return (
    <Button onClick={() => handleClickSignoutButton()} disabled={isPending}>
      {isPending ? "Signing out..." : "Sign Out"}
    </Button>
  )
}
