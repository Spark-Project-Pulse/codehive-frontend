'use client'

import SignOutButton from '@/components/profiles/SignOutButton'

export default function ProfilePage({
  params,
}: {
  params: { user_id: string }
}) {
  return (
    <div>
      <h1>profile page</h1>
      <SignOutButton />
    </div>
  )
}
