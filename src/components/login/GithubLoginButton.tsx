import { type Provider } from '@supabase/supabase-js'
import { useTransition } from 'react'
import { Button } from '../ui/button'
import { loginAction } from '@/api/auth'
import { useRouter } from 'next/navigation'
import { toast } from '../ui/use-toast'

export default function GithubLoginButton() {
  const [isPending, startTransaction] = useTransition()
  const router = useRouter()

  const handleClickLoginButton = (provider: Provider) => {
    startTransaction(async () => {
      const { errorMessage, url } = await loginAction(provider)
      if (!errorMessage && url) {
        router.push(url)
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
    <Button onClick={() => handleClickLoginButton('github')} disabled={isPending}>
      {isPending ? "Logging in..." : "Login with GitHub"}
    </Button>
  )
}
