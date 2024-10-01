import { cn } from '@/lib/utils'

export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number
  className?: string
}

export const LoadingSpinner = ({
  size = 48,
  className,
  ...props
}: ISVGProps) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-2">
      <p className="text-lg font-semibold">Loading...</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn('animate-spin', className)}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  )
}