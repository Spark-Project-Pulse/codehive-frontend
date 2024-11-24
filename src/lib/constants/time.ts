export const REFRESH_INTERVALS = {
  REAL_TIME: 5000,          // 5 seconds: Chat apps, live trading
  FREQUENT: 30000,          // 30 seconds: Social media feeds, gaming
  STANDARD: 60000,          // 1 minute: Dashboards, moderate updates
  CONSERVATIVE: 180000,     // 3 minutes: Notifications, email-like updates
  INFREQUENT: 300000,       // 5 minutes: News feeds, weather updates
  RARE: 900000              // 15 minutes: Static content, daily summaries
} as const

/**
 * Utility functions for time conversions
 * 
 * @namespace Time
 * @property {function} seconds - Converts seconds to milliseconds
 * @property {function} minutes - Converts minutes to milliseconds
 * @property {function} hours - Converts hours to milliseconds
 * @property {function} toSeconds - Converts milliseconds to seconds
 * @property {function} intervalToSeconds - Converts a `RefreshInterval` to seconds
 */
export const Time = {
  seconds: (s: number) => s * 1000,
  minutes: (m: number) => m * 60 * 1000,
  hours: (h: number) => h * 60 * 60 * 1000,
  toSeconds: (ms: number) => Math.floor(ms / 1000),
  intervalToSeconds: (interval: RefreshInterval) => 
    Math.floor(REFRESH_INTERVALS[interval] / 1000)
}

export type RefreshInterval = keyof typeof REFRESH_INTERVALS