'use client'
import { signOut } from "@/utils/firebase/auth";
import { SidebarMenuButton } from "./sidebar";
import { CloudCog, LogOut } from "lucide-react";


export default function SignOutButton() {
    return (
        <SidebarMenuButton onClick={signOut}>
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
        </SidebarMenuButton>
    )
}