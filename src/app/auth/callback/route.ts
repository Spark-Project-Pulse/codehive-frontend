// src/app/auth/callback/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'; // Import the createClient function
import { createUser, getUserById, userExists } from '@/api/users';
import { setUserCookie } from '@/lib/cookies';
// import { type AuthUser } from '@/types/Users';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  let next = searchParams.get('next') ?? '/';

  // console.log("Checking code exists", code);
  
  if (code) {
    console.log("Creating supabase client");
    // Create the Supabase client
    const supabase = await createClient();
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    console.log("Exchanging code for session", error);

    
    if (!error) {
      // Get the authenticated user after exchanging the code for a session
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        // Check if the user exists in the database
        const existsResponse = await userExists(authUser.id);

        if (existsResponse.errorMessage) {
          console.error(
            'Error checking user existence: ',
            existsResponse.errorMessage
          );
          return NextResponse.redirect(`${origin}/error`);
        }

        // If the user doesn't exist, create a new user in the DB
        console.log("Checked if user exists", existsResponse);
        console.log("Does user exist?", existsResponse.data?.exists);
        
        if (!existsResponse.data?.exists) {
          console.log('Starting createUser call...');
          const createUserResponse = await createUser({
            user: authUser.id,
            username: authUser.user_metadata.user_name as string, // TODO: figure out better approach than `as string`
            reputation: 0,
          });

          if (createUserResponse.errorMessage) {
            console.error(
              'Error creating user: ',
              createUserResponse.errorMessage
            );
            return NextResponse.redirect(`${origin}/error`);
          }

          // Since the user is new, redirect them to the tutorial page instead of the home page
          next = '/tutorial';
        }
      } else {
        console.error('Error: User not found after authentication');
        return NextResponse.redirect(`${origin}/error`);
      }
      
      // Get full user object from the DB
      const response = await getUserById(authUser.id)

      if (response.errorMessage) {
        // render error to the user
        console.error(
          'Error getting user: ',
          response.errorMessage
        )
        return NextResponse.redirect(`${origin}/error`);
      }

      if (response.data) {
        setUserCookie(response.data)
      }

      // After handling user creation/check, redirect to the desired page
      const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login`);
}
