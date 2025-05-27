import { getAuthenticatedAppForUser } from "@/utils/firebase/server-app";
import Link from "next/link";
import AuthCard from "@/components/ui/auth-card";
import { redirect } from "next/navigation";
import { User } from "firebase/auth";
export default async function AuthLayout({ children }: {
    children: React.ReactNode
}) {
    const { currentUser } = await getAuthenticatedAppForUser();
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Logo */}
                <div className="text-center">
                    <Link href="/" className="inline-block">
                        <h1 className="text-3xl font-bold text-violet-600">InsAight</h1>
                    </Link>
                    <p className="mt-2 text-gray-600">Sign in to analyze your YouTube comments</p>
                </div>

                {/* Auth Card */}
                <AuthCard initialUser={currentUser?.toJSON()} />

                {/* Features Preview */}
                <div className="text-center space-y-4">
                    <p className="text-sm text-gray-600">What you'll get access to:</p>
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                        <div className="flex items-center justify-center space-x-1">
                            <span>🎯</span>
                            <span>Sentiment Analysis</span>
                        </div>
                        <div className="flex items-center justify-center space-x-1">
                            <span>📊</span>
                            <span>Comment Grouping</span>
                        </div>
                        <div className="flex items-center justify-center space-x-1">
                            <span>⚡</span>
                            <span>Instant Insights</span>
                        </div>
                        <div className="flex items-center justify-center space-x-1">
                            <span>🔒</span>
                            <span>Secure Access</span>
                        </div>
                    </div>
                </div>
            </div>
            {children}
        </div>
    )
}