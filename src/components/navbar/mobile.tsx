import { PiList } from "react-icons/pi";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { ThemeSwitcher } from "../theme-switcher";

export function MobileNavbar() {
  return (
    <div className="flex w-full justify-between items-center sm:hidden">
      <Link href="/">
        <div className="bg-gradient-to-tr from-30% from-purple-500/70 via-50% via-yellow-500/70 to-80% to-rose-600/70 p-[0.1rem] rounded-md">
          <div className="bg-background p-1 rounded-md">
            <h1 className="text-2xl font-light text-transparent bg-clip-text bg-gradient-to-tr from-30% from-purple-500 via-yellow-500 to-rose-600">
              Index
            </h1>
          </div>
        </div>
      </Link>

      <div className="flex gap-2">
        <div className="border-r border-input px-1">
            <ThemeSwitcher />
        </div>
        <div className="px-1">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center" asChild>
              <Button variant="outline" size="icon">
                <PiList size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/about">About</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
