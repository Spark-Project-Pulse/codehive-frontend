import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  // NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  // NavigationMenuViewport,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"


export default function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className=" mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Logo
        </Link>
        <div className="flex space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              
              {/* Questions */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Questions</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <Link href="/ask-question" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Ask a Question
                    </NavigationMenuLink>
                  </Link>
                  <Link href="/answer-question" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Answer a Question
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Sign In (and Sign Up) */}
              <NavigationMenuItem>
                <Link href="/sign-in" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Sign In
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

        </div>
      </div>
    </nav>
  );
}