export const REFRESH_INTERVALS = {
  REAL_TIME: 5000,        // 5 seconds: Chat apps, live trading
  FREQUENT: 30000,        // 30 seconds: Social media feeds, gaming
  STANDARD: 60000,        // 1 minute: Dashboards, moderate updates
  CONSERVATIVE: 180000,   // 3 minutes: Notifications, email-like updates
  INFREQUENT: 300000,    // 5 minutes: News feeds, weather updates
  RARE: 900000           // 15 minutes: Static content, daily summaries
} as const // Makes the values readonly

// You might also want to add some helper functions
export const Time = {
  seconds: (s: number) => s * 1000,
  minutes: (m: number) => m * 60 * 1000,
  hours: (h: number) => h * 60 * 60 * 1000
}

// Optional: Type for the intervals
export type RefreshInterval = keyof typeof REFRESH_INTERVALS


/* Usage examples:

  // src/app/notifications/page.tsx (or wherever your component is)
  import { REFRESH_INTERVALS, Time } from '@/lib/constants/time'

  export default function ProfilePage() {
    // Use it directly
    const REFRESH_INTERVAL = REFRESH_INTERVALS.CONSERVATIVE

    // Or use the helper functions
    const CUSTOM_INTERVAL = Time.minutes(2) // 2 minutes in milliseconds

    // ... rest of your component
  }

*/