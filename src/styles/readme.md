This folder should be used for things like the following (for using consisntent styling across the appication). `globals.css` should not live here according to the [Next.js docs](https://nextjs.org/docs/pages/building-your-application/styling#adding-a-global-stylesheet)

Example file (`TextStyles.tsx`)
``` ts
export const AdminTextStyles = {
  title: `text-4xl font-bold dark:text-white mb-6 text-purple-800`,
  subtitle: `text-2xl font-bold dark:text-white mb-4`,
  paragraph: `text-lg font-semibold dark:text-white mb-6`, // Onboarding
  subparagraph: `text-sm font-normal text-gray-500 dark:text-gray-400`, // Onboarding
  default: `text-base dark:text-white mb-1`, // Input/question titles
  subtext: `text-sm dark:text-white mb-1`, // Onboarding
  content: "font-normal text-gray-700 dark:text-gray-400 whitespace-pre-line", // Multi-line formatted paragraph
  subcontent: "text-sm font-normal text-gray-700 dark:text-gray-400 whitespace-pre-line", // Multi-line formatted paragraph
  datepicker: `bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-400 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 p-2.5`,
  card: `hover:bg-gray-100 dark:hover:bg-gray-600 dark:shadow-gray-900 dark:bg-background-dark cursor-pointer`,
}
```