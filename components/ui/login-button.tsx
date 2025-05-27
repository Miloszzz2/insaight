'use client'
import { signInWithGoogle } from "@/utils/firebase/auth";
import { Button } from "./button";
import { Youtube } from "lucide-react";

export default function LoginButton() {
    return (
        <Button
            onClick={signInWithGoogle}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 text-base font-medium"
            size="lg"
        >
            <Youtube className="w-8 h-8 mr-1" />
            Continue with Google
        </Button>
    )
}