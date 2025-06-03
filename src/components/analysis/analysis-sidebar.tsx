'use client';
import { use, useState } from "react";
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarMenuAction } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Category } from "@/types/db/comment-group";
import { Film, Lightbulb, Mic, Music, MessageCircle } from "lucide-react";
import { DynamicIcon } from "@/utils/analysis/dynamic-icon";

export function AnalysisSidebar({ categories, isAnalyzed }: { categories: Category[]; isAnalyzed: boolean }) {
   const categoryConfig = [
      { id: "editing", name: "Montage / Editing", icon: Film, count: 0, active: true },
      {
         id: "suggestions",
         name: "Future Video Ideas",
         icon: Lightbulb,
         count: 0,
         active: false,
      },
      { id: "host", name: "Host Feedback", icon: Mic, count: 0, active: false },
      { id: "sound", name: "Sound / Music", icon: Music, count: 0, active: false },
      { id: "general", name: "General Impressions", icon: MessageCircle, count: 0, active: false },
   ]

   return (
      <Sidebar>
         <SidebarHeader>
            <div className="px-2 py-2">
               <h2 className="text-lg font-semibold text-gray-900">Comment Categories</h2>
            </div>
         </SidebarHeader>

         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupLabel>Categories</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {!isAnalyzed && categoryConfig.map((category) => {
                        const IconComponent = category.icon
                        return (
                           <SidebarMenuItem key={category.id} >
                              <SidebarMenuButton isActive={category.active && isAnalyzed} disabled={!isAnalyzed} className="h-12 flex justify-between items-center">
                                 <div className="flex items-center gap-2">
                                    <IconComponent className="w-4 h-4" />
                                    <span className={!isAnalyzed ? "text-gray-400" : ""}>{category.name}</span>
                                 </div>
                                 <Badge
                                    variant="secondary"
                                    className={`ml-auto ${category.active && isAnalyzed ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-600"
                                       }`}
                                 >
                                    {category.count}
                                 </Badge>

                              </SidebarMenuButton>
                           </SidebarMenuItem>
                        )
                     })}
                     {isAnalyzed && categories.map((category: Category) => {
                        return (
                           <SidebarMenuItem key={category.name}>
                              <SidebarMenuButton disabled={!isAnalyzed} className="h-12 flex justify-between items-center">
                                 <div className="flex items-center gap-2">
                                    <DynamicIcon name={category.icon} className="w-4 h-4 text-gray-600" />
                                    <span className={!isAnalyzed ? "text-gray-400" : ""}>{category.name}</span>
                                 </div>
                                 <Badge variant="secondary" className={`ml-auto ${isAnalyzed ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-600"}`}>
                                    {category.count}
                                 </Badge>
                              </SidebarMenuButton>
                           </SidebarMenuItem>
                        )
                     })}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>

         <SidebarFooter>
            <div className="px-2 py-2">
               <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                     <AvatarImage src="/placeholder.svg?height=32&width=32" />
                     <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div>
                     <div className="text-sm font-medium text-gray-900">Sarah Chen</div>
                     <div className="text-xs text-gray-600">@sarahcreates</div>
                  </div>
               </div>
            </div>
         </SidebarFooter>
      </Sidebar>
   )
}