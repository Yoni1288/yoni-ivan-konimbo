import type { Metadata } from "next"
import { Inter, Instrument_Serif } from "next/font/google"
import { cn } from "@/shared/utils/cn"
import { Providers } from "./providers"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-instrument-serif" })

export const metadata: Metadata = {
  title: "Yoni Ivan",
  description: "Thoughtfully made goods for everyday life",
}

const RootLayout = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  return (
    <html lang="en" className={cn(inter.variable, instrumentSerif.variable)}>
      <body className="flex min-h-screen flex-col bg-canvas font-sans text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export default RootLayout
