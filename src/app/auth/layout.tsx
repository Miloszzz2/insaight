import Link from "next/link";
import { Brain } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { signInWithGoogle } from "./actions/sign-in-with-google";

export default async function AuthLayout() {
	return (
		<div className="flex min-h-screen">
			{/* Left Side - Auth Form */}
			<div className="w-full lg:w-1/2 bg-gray-900 p-8 flex flex-col justify-between">
				<div className="relative h-full w-full">
					{/* Logo */}
					<div className="flex items-center space-x-2p">
						<div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
							<Brain className="w-5 h-5 text-white" />
						</div>
						<h1 className="text-xl font-bold text-white">InsAight</h1>
					</div>

					{/* Auth Form */}
					<div className="w-3/5 h-full mx-auto flex-col flex justify-center">
						<div className="mb-8">
							<h2 className="text-3xl font-bold text-white mb-2">
								Welcome back
							</h2>
							<p className="text-gray-400">Sign in to your account</p>
						</div>

						{/* Google Login */}
						<div className="space-y-4 mb-6">
							<form action={signInWithGoogle}>
								<Button
									type="submit"
									className="w-full bg-white hover:bg-gray-100 text-gray-900 flex items-center justify-center space-x-2 py-6"
								>
									<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
										<path
											d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
											fill="#4285F4"
										/>
										<path
											d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
											fill="#34A853"
										/>
										<path
											d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
											fill="#FBBC05"
										/>
										<path
											d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
											fill="#EA4335"
										/>
									</svg>
									<span className="font-medium">
										Continue with Google
									</span>
								</Button>
							</form>
						</div>

						<div className="mt-6 text-center">
							<p className="text-gray-400 text-sm">
								Don't have an account?{" "}
								<Link
									href="/auth/signup"
									className="text-violet-400 hover:text-violet-300 font-medium"
								>
									Sign Up Now
								</Link>
							</p>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="mt-12 text-center text-xs text-gray-500">
					<p>
						By continuing, you agree to InsAight's{" "}
						<Link
							href="/terms"
							className="text-gray-400 hover:text-white"
						>
							Terms of Service
						</Link>{" "}
						and{" "}
						<Link
							href="/privacy"
							className="text-gray-400 hover:text-white"
						>
							Privacy Policy
						</Link>
						, and to receive periodic emails with updates.
					</p>
				</div>
			</div>

			{/* Right Side - Testimonial */}
			<div className="hidden lg:flex lg:w-1/2 bg-black p-12 items-center justify-center relative overflow-hidden">
				{/* Background Pattern */}
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_40%)]"></div>
					<div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.3),transparent_40%)]"></div>
				</div>

				<div className="max-w-lg relative z-10">
					{/* Quote Mark */}
					<div className="text-9xl font-serif text-gray-700 absolute -top-20 -left-4 opacity-30">
						"
					</div>

					<blockquote className="text-2xl text-white leading-relaxed mb-8">
						Now things are starting to get interesting! YouTube comments
						have always been a goldmine of feedback, but they're
						overwhelming to process manually. InsAight is the perfect
						solution for creators who want to understand their audience
						better.
					</blockquote>

					<div className="flex items-center space-x-4">
						<Avatar className="w-12 h-12 border-2 border-violet-600">
							<AvatarImage src="/placeholder.svg?height=48&width=48" />
							<AvatarFallback className="bg-violet-900 text-white">
								SC
							</AvatarFallback>
						</Avatar>
						<div>
							<div className="text-white font-medium">Sarah Chen</div>
							<div className="text-gray-400">
								@sarahcreates • 1.2M subscribers
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
