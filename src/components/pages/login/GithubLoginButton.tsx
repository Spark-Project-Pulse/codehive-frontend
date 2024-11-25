import { type Provider } from '@supabase/supabase-js'
import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { loginAction } from '@/api/auth'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { ButtonLoadingSpinner } from '@/components/ui/loading'
import Image from 'next/image'

export default function GithubLoginButton() {
  const [isPending, startTransaction] = useTransition()
  const router = useRouter()

  const handleClickLoginButton = (provider: Provider) => {
    startTransaction(async () => {
      const response = await loginAction(provider)
      const { errorMessage, data } = response

      if (!errorMessage && data?.url) {
        toast({
          title: 'Success!',
          description: 'Signed in successfully',
        })
        router.push(data.url)
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
    <Button
      onClick={() => handleClickLoginButton('github')}
      disabled={isPending}
      className="flex items-center space-x-2 w-full"
    >
      {isPending ? (
        <>
          <ButtonLoadingSpinner />
          <span>Logging in...</span>
        </>
      ) : (
        <>
          <Image
            src="/github-logo.png"
            alt="Github logo"
            width={20}
            height={20}
            className="h-5 w-5"
          />
          <span>Login with GitHub</span>
        </>
      )}
    </Button>
  )
}
