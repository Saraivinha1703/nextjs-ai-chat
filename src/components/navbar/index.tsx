import { DesktopNavbar } from "./desktop";
import { MobileNavbar } from "./mobile";

export function Navbar() {

  return (
    <nav className="flex top-0 sticky justify-between items-center p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30 w-full h-16 bg-background/95 border-b border-input">
      <DesktopNavbar />
      <MobileNavbar />
    </nav>
  );
}
