import Link from 'next/link'
import siteConfig from '@/components/universal/footer/site-config'
import { Linkedin, Instagram, Facebook, Twitter } from 'lucide-react'

export default function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border/40 dark:border-border md:px-8 md:py-0">
      <div className="container flex justify-center pt-8">
        <p className="text-balance text-center font-body text-base leading-loose md:text-lg">
          Built with 💛 by a couple of BU students. Check us out on{' '}
          <Link
            href={siteConfig.links.github}
            className="font-medium underline underline-offset-4 hover:text-black dark:hover:text-white"
            target="_blank"
            rel="noreferrer"
            aria-label="Visit GitHub (opens in a new tab)"
          >
            GitHub
          </Link>
          .
        </p>
      </div>
      <div className="container flex flex-col items-center justify-center gap-4 py-6 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose">
          &copy; {new Date().getFullYear()} CodeHive Inc.
        </p>
        <Link
          href="/terms-of-service"
          className="text-balance text-center text-sm leading-loose  underline underline-offset-4 hover:text-black dark:hover:text-white"
        >
          Terms
        </Link>
        <Link
          href="/privacy-policy"
          className="text-balance text-center text-sm leading-loose  underline underline-offset-4 hover:text-black dark:hover:text-white"
        >
          Privacy
        </Link>
        <Link
          href="/code-of-conduct"
          className="text-balance text-center text-sm leading-loose  underline underline-offset-4 hover:text-black dark:hover:text-white"
        >
          Code of Conduct
        </Link>
        <Link
          href="mailto:contact@codehive.buzz"
          className="text-balance text-center text-sm leading-loose  underline underline-offset-4 hover:text-black dark:hover:text-white"
        >
          Contact
        </Link>
        {/* Social Links */}
        <div className="flex space-x-4">
          {' '}
          {[Linkedin, Instagram, Facebook, Twitter].map((Icon, index) => (
            <a
              key={index}
              href="#"
              className=" transition-colors duration-300 hover:text-black dark:hover:text-white"
            >
              <Icon size={24} />{' '}
              <span className="sr-only">Social Media Link</span>{' '}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
