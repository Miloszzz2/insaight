'use client'
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LoginButton from "@/components/ui/login-button"
import { useEffect } from "react"
import { onIdTokenChanged } from "@/utils/firebase/auth"
import { setCookie, deleteCookie } from 'cookies-next'
import { User } from "firebase/auth"
import { redirect } from "next/navigation"

function useUserSession(initialUser: any) {
  useEffect(() => {
    return onIdTokenChanged(async (user: User) => {
      if (user) {
        const idToken = await user.getIdToken();
        await setCookie("__session", idToken);
      } else {
        await deleteCookie("__session");
      }
      if (initialUser?.uid === user?.uid) {
        return;
      }
      window.location.reload();
    });
  }, [initialUser]);

  return initialUser;
}


export default function AuthCard({ initialUser }: any) {
  const user = useUserSession(initialUser);
  return (
    <Card className="bg-white shadow-lg border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
        <CardDescription className="text-gray-600">
          Connect your YouTube account to get started with AI-powered comment analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Google OAuth Button */}

        <LoginButton />


        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Secure & Private</span>
          </div>
        </div>

        {/* Security Note */}
        <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-violet-800">Your data is safe</h3>
              <p className="text-sm text-violet-700 mt-1">
                We only access your public YouTube data and never store personal information.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-violet-600">
            ←  Back to home
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
