import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next AI Chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.className}`}>
        <ThemeProvider
          enableSystem
          themes={["light", "dark"]}
          defaultTheme="system"
          disableTransitionOnChange
          attribute="class"
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            {/* <Footer /> */}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
