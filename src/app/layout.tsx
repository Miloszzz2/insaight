import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans, Outfit, Roboto } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const poppins = Outfit({ weight: "600" })

export const metadata: Metadata = {
  title: "InsAight - AI-Powered YouTube Comment Analysis",
  description:
    "Transform your YouTube comments into actionable insights with AI-powered sentiment analysis and smart categorization.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  )
}
