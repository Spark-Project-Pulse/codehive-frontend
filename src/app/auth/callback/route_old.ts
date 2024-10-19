import { NextResponse } from 'next/server'
import { getSupabaseAuth, getUser } from '@/utils/supabase/server_old'
import { createUser, userExists } from '@/api/users'
import { type AuthUser } from '@/types/Users'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await getSupabaseAuth()
    const { error } = await supabase.exchangeCodeForSession(code)

    if (!error) {
      // Get the authenticated user after exchanging the code for a session
      const authUser = (await getUser()) as AuthUser | null // Type 'authUser'

      if (authUser) {
        // Check if the user exists in the database
        const existsResponse = await userExists(authUser.id)

        if (existsResponse.errorMessage) {
          console.error(
            'Error checking user existence: ',
            existsResponse.errorMessage
          )
          return NextResponse.redirect(`${origin}/error`)
        }

        // If the user doesn't exist, create a new user in the DB
        if (!existsResponse.data?.exists) {
          const createUserResponse = await createUser({
            user: authUser.id,
            username: authUser.user_metadata.user_name,
            reputation: 0,
          })

          if (createUserResponse.errorMessage) {
            console.error(
              'Error creating user: ',
              createUserResponse.errorMessage
            )
            return NextResponse.redirect(`${origin}/error`)
          }

          // Since the user is new, redirect them to the tutorial page instead of the home page
          next = '/tutorial'
        }
      } else {
        console.error('Error: User not found after authentication')
        return NextResponse.redirect(`${origin}/error`)
      }

      // After handling user creation/check, redirect to the desired page
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login`)
}
