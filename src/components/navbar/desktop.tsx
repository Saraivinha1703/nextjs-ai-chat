import { Button } from "../ui/button";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { ThemeSwitcher } from "../theme-switcher";

export function DesktopNavbar() {
  return (
    <div className="justify-between hidden sm:flex sm:w-full">
      <Link href="/" className="relative group">
        <div className="transition-all duration-300 bg-gradient-to-tr from-30% from-purple-500/70 via-50% via-yellow-500/70 to-80% to-rose-600/70 p-[0.1rem] rounded-md opacity-0 group-hover:opacity-100">
          <div className="bg-background p-1 rounded-md">
            <h1 className="text-2xl select-none font-light text-transparent bg-clip-text bg-gradient-to-tr from-30% from-purple-500 via-yellow-500 to-rose-600">
              Chat
            </h1>
          </div>
        </div>

        <div className="absolute transition-all duration-300 top-0 p-[0.1rem] opacity-100 group-hover:opacity-0">
          <div className="bg-transparent p-1 rounded-md">
            <h1 className="text-2xl font-light select-none">Chat</h1>
          </div>
        </div>
      </Link>

      <div className="flex justify-between items-center gap-6 md:gap-20">
        <div className="flex gap-4">
          <Link
            href="/about"
            className="select-none hover:underline"
            as="/about"
          >
            About
          </Link>
          <Link
            href="/chat-with-tools"
            className="select-none hover:underline"
            as="/chat-with-tools"
          >
            Chat With Tools
          </Link>
          <Link
            href="/generative-ui"
            className="select-none hover:underline"
            as="/generative-ui"
          >
            Generative UI Chat
          </Link>
          <Link
            href="/semantic-search"
            className="select-none hover:underline"
            as="/semantic-search"
          >
            Semantic Search
          </Link>
        </div>

        <div className="flex items-center">
          <Link
            className="border-r border-input px-1"
            href="https://www.linkedin.com/in/carlos-saraiva-neto/"
            target="_blank"
          >
            <Button variant="ghost" size="icon">
              <LinkedInLogoIcon className="h-4 w-4" />
            </Button>
          </Link>

          <Link
            className="border-r border-input px-1"
            href="https://github.com/Saraivinha1703"
            target="_blank"
          >
            <Button variant="ghost" size="icon">
              <GitHubLogoIcon className="h-4 w-4" />
            </Button>
          </Link>

          <div className="px-1">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}
