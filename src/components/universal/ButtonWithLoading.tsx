import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ButtonLoadingSpinner } from '@/components/ui/loading'

interface ButtonWithLoadingProps {
  onClick?: () => Promise<void> // The async operation to execute
  buttonText: string // Initial text for the button
  buttonType: 'button' | 'submit' | 'reset' // The desired type for the button (i.e. submit, button, reset)
  isLoading?: boolean // External loading state
}

export const ButtonWithLoading: React.FC<ButtonWithLoadingProps> = ({
  onClick,
  buttonText,
  buttonType,
  isLoading,
}) => {
  const [internalPending, setInternalPending] = useState(false)

  const handleClick = async () => {
    if (!onClick) return
    setInternalPending(true)
    try {
      await onClick()
    } finally {
      setInternalPending(false)
    }
  }

  const loadingState = isLoading ?? internalPending

  return (
    <Button
      type={buttonType}
      onClick={handleClick}
      disabled={loadingState}
      className={`flex items-center space-x-2`}
    >
      {loadingState ? (
        <>
          <ButtonLoadingSpinner />
          <span>Loading...</span>
        </>
      ) : (
        <span>{buttonText}</span>
      )}
    </Button>
  )
}
