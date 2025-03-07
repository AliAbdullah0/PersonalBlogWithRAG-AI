import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: "AstraX | Blogs",
  description: "Discover Insightful Stories & Ideas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased`}
      >
        <Analytics/>
        <Navigation/>
        {children}
        <footer>
          <Footer/>
        </footer>

      </body>
    </html>
  );
}
