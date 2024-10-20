import React from 'react';
import { Button } from '@/components/ui/button';
import { ButtonLoadingSpinner } from '@/components/ui/loading';

interface ButtonWithLoadingProps {
  isLoading: boolean; // Indicates if the button should show a loading state
  buttonText: string; // Text displayed on the button
  buttonType: 'button' | 'submit' | 'reset'; // The type attribute for the button
  onClick?: () => void; // keeping this
}

export const ButtonWithLoading: React.FC<ButtonWithLoadingProps> = ({
  isLoading,
  buttonText,
  buttonType,
  onClick,
}) => {
  return (
    <Button
      type={buttonType}
      onClick={onClick}
      disabled={isLoading}
      className={`flex items-center space-x-2`}
    >
      {isLoading ? (
        <>
          <ButtonLoadingSpinner />
          <span>Loading...</span>
        </>
      ) : (
        <span>{buttonText}</span>
      )}
    </Button>
  );
};
