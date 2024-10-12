'use client'

import { signOutAction } from '@/api/auth'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'

export default function SignOutButton() {
  const router = useRouter()
  const [isPending, startTransaction] = useTransition()

  const handleClickSignoutButton = () => {
    startTransaction(async () => {
      const response = await signOutAction()
      const { errorMessage } = response

      if (!errorMessage) {
        toast({
          title: 'Success!',
          description: 'Signed out successfully',
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
      {isPending ? 'Signing out...' : 'Sign Out'}
    </Button>
  )
}
