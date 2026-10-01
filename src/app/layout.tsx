import type { Metadata } from "next"
import { Inter, Instrument_Serif } from "next/font/google"
import { SiteFooter } from "@/shared/components/site-footer"
import { SiteHeader } from "@/shared/components/site-header"
import { Providers } from "./providers"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-instrument-serif" })

export const metadata: Metadata = {
  title: "Goodsmith",
  description: "Thoughtfully made goods for everyday life",
}

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Providers>
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  )
}
