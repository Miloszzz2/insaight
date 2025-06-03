import React, { Suspense } from "react"
import { Film, Lightbulb, Mic, Music, MessageCircle, ArrowLeft, ThumbsUp, ThumbsDown, Minus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"


export default async function AnalysisLayout({
   params,
   children
}: {
   params: Promise<{ id: string }>,
   children: React.ReactNode
}) {
   const { id } = await params

   return (
      <div> {children}</div>
   )
}