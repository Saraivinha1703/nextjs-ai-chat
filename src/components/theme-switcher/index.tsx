"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { PiMoonStars, PiSun } from "react-icons/pi";

export function ThemeSwitcher() {
    const [mounted, setMounted] = useState<boolean>(false);
   const { resolvedTheme, setTheme } = useTheme();

    useEffect(() => setMounted(true), []);

    const Icon =
      resolvedTheme === "dark" ? (
        <PiMoonStars size={20} />
      ) : (
        <PiSun size={20} />
      );
    
     return (
       mounted && (
         <Button
           onClick={() =>
             resolvedTheme == "dark" ? setTheme("light") : setTheme("dark")
           }
           variant="ghost"
           size="icon"
         >
           {Icon}
         </Button>
       )
     );
};
