import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "./actions";
import { Youtube } from "lucide-react";

export default async function AuthLayout({ children }: {
    children: React.ReactNode
}) {
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
                <Card className="bg-white shadow-lg border-0">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
                        <CardDescription className="text-gray-600">
                            Connect your YouTube account to get started with AI-powered comment analysis
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Google OAuth Button */}
                        <form action={signInWithGoogle}>
                            <Button
                                type="submit"
                                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 text-base font-medium"
                                size="lg"
                            >
                                <Youtube className="w-8 h-8 mr-1" />
                                Continue with Google
                            </Button>
                        </form>
                        {/* Divider */}
                        <div className="relative mt-2">
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