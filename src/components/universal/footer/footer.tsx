import Link from "next/link"
import siteConfig from "@/components/universal/footer/site-config"
import { Linkedin, Instagram, Facebook, Twitter } from 'lucide-react'

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/40 dark:border-border md:px-8 md:py-0">
      <div className="container flex justify-center pt-8">
        <p className="text-balance text-center text-base leading-loose text-muted-foreground md:text-lg">
          Built with 💛 by a couple of BU students. Check us out on{" "}
          <Link
            href={siteConfig.links.github}
            className="font-medium underline underline-offset-4 hover:text-black dark:hover:text-white"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </Link>
          .
        </p>
      </div>
      <div className="container flex flex-col items-center justify-center gap-4 py-6 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
          &copy; {new Date().getFullYear()} CodeHive Inc.
        </p>
        <Link
          href="/terms-of-service"
          className="text-balance text-center text-sm leading-loose text-muted-foreground underline underline-offset-4 hover:text-black dark:hover:text-white"
        >
          Terms
        </Link>
        <Link
          href="/privacy-policy"
          className="text-balance text-center text-sm leading-loose text-muted-foreground underline underline-offset-4 hover:text-black dark:hover:text-white"
        >
          Privacy
        </Link>
        <Link
          href="/code-of-conduct"
          className="text-balance text-center text-sm leading-loose text-muted-foreground underline underline-offset-4 hover:text-black dark:hover:text-white"
        >
          Code of Conduct
        </Link>
        <Link
          href="mailto:contact@codehive.buzz"
          className="text-balance text-center text-sm leading-loose text-muted-foreground underline underline-offset-4 hover:text-black dark:hover:text-white"
        >
          Contact
        </Link>
        {/* Social Links */}
        <div className="flex space-x-4"> {
          [Linkedin, Instagram, Facebook, Twitter].map((Icon, index) =>
          (<a key={index} href="#" className="text-muted-foreground hover:text-black dark:hover:text-white transition-colors duration-300">
            <Icon size={24} /> <span className="sr-only">Social Media Link</span> </a>))
        }
        </div>
      </div>
    </footer>
  )
}