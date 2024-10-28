'use client'

import { useEffect } from 'react'
import { useNextStep } from 'nextstepjs'
import { useUser } from '@/app/contexts/UserContext'

export default function TutorialPage() {
  const { startNextStep } = useNextStep()
  const { user, loading } = useUser()

  useEffect(() => {
    if (!loading && user) {
      startNextStep("mainTour")
    }
  }, [startNextStep, user, loading])

  return null
}