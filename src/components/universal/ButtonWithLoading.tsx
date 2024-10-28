import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ButtonLoadingSpinner } from '@/components/ui/loading'

interface ButtonWithLoadingProps {
  id?: string // Optional id for the button
  onClick: () => Promise<void> // The async operation to execute
  buttonText: string // Initial text for the button
  buttonType: 'button' | 'submit' | 'reset' // The desired type for the button (i.e. submit, button, reset)
}

export const ButtonWithLoading: React.FC<ButtonWithLoadingProps> = ({
  id,
  onClick,
  buttonText,
  buttonType,
}) => {
  const [isPending, setIsPending] = useState(false)

  const handleClick = async () => {
    setIsPending(true)
    try {
      await onClick()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button
      id={id}
      type={buttonType}
      onClick={handleClick}
      disabled={isPending}
      className={`flex items-center space-x-2`}
    >
      {isPending ? (
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