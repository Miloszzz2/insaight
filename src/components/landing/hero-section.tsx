"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import { Play, Brain, Youtube, Twitter, Instagram } from "lucide-react";

export function HeroSection() {
	const [isVisible, setIsVisible] = useState(false);
	const [typedText, setTypedText] = useState("");
	const fullText = "Your next great content strategy";

	useEffect(() => {
		setIsVisible(true);

		// Typing animation
		let currentIndex = 0;
		const typingInterval = setInterval(() => {
			if (currentIndex <= fullText.length) {
				setTypedText(fullText.slice(0, currentIndex));
				currentIndex++;
			} else {
				clearInterval(typingInterval);
			}
		}, 100);

		return () => clearInterval(typingInterval);
	}, []);

	return (
		<section className="relative min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 overflow-hidden">
			{/* Navigation */}
			<nav
				className={`relative z-10 px-4 sm:px-6 lg:px-8 py-6 transition-all duration-1000 ${
					isVisible
						? "translate-y-0 opacity-100"
						: "-translate-y-10 opacity-0"
				}`}
			>
				<div className="max-w-7xl mx-auto flex justify-between items-center">
					<div className="flex items-center space-x-2 animate-slide-in-left">
						<div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
							<Brain className="w-5 h-5 text-violet-600" />
						</div>
						<h1 className="text-xl font-bold text-white">InsAight</h1>
					</div>

					<div className="hidden md:flex items-center space-x-6 animate-slide-in-down text-md">
						<Link
							href="#features"
							className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105"
						>
							Features
						</Link>
						<Link
							href="#testimonials"
							className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105"
						>
							Testimonials
						</Link>
						<Link
							href="#pricing"
							className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105"
						>
							Pricing
						</Link>
					</div>

					<div className="flex items-center space-x-4 animate-slide-in-right">
						<div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
							<Youtube className="w-5 h-5 text-white" />
							<Twitter className="w-5 h-5 text-white" />
							<Instagram className="w-5 h-5 text-white" />
						</div>
						<Link href="/auth">
							<Button className="text-md bg-white text-violet-900 hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg">
								Get Started
							</Button>
						</Link>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Left Content */}
					<div
						className={`space-y-8 transition-all duration-1000 delay-300 ${
							isVisible
								? "translate-x-0 opacity-100"
								: "-translate-x-10 opacity-0"
						}`}
					>
						<div className="space-y-6">
							<div className="relative">
								<h1 className="text-5xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
									<span className="inline-block animate-fade-in-up">
										{typedText}
										<span className="animate-blink">|</span>
									</span>
									<br />
									<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400 animate-gradient-x"></span>
								</h1>
							</div>

							<p
								className="text-xl text-white/80 max-w-lg animate-fade-in-up"
								style={{ animationDelay: "0.8s" }}
							>
								We team up with creators to unlock cutting-edge insights
								from YouTube comments. Let&apos;s build something
								amazing together.
							</p>
						</div>

						<div
							className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
							style={{ animationDelay: "1s" }}
						>
							<Link href="/auth">
								<Button
									size="lg"
									className="bg-white text-violet-900 hover:bg-gray-100 px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group"
								>
									<Play className="w-5 h-5 mr-2 group-hover:animate-pulse" />
									Start Analyzing
								</Button>
							</Link>
							<Button
								variant="outline"
								size="lg"
								className="bg-purple-600 border-white/30 text-white  px-8 py-4 text-lg transition-colors duration-500"
							>
								Watch Demo
							</Button>
						</div>

						{/* Stats */}
						<div
							className="flex items-center space-x-8 pt-8 animate-fade-in-up"
							style={{ animationDelay: "1.2s" }}
						>
							<div className="text-center animate-count-up">
								<div className="text-3xl font-bold text-white">
									10K+
								</div>
								<div className="text-lg text-white/60">Creators</div>
							</div>
							<div
								className="text-center animate-count-up"
								style={{ animationDelay: "0.2s" }}
							>
								<div className="text-3xl font-bold text-white">2M+</div>
								<div className="text-lg text-white/60">Comments</div>
							</div>
							<div
								className="text-center animate-count-up"
								style={{ animationDelay: "0.4s" }}
							>
								<div className="text-3xl font-bold text-white">95%</div>
								<div className="text-lg text-white/60">Accuracy</div>
							</div>
						</div>
					</div>

					<div className="relative ml-4 animate-fade-in-delayed  !delay-400">
						<div className="bg-violet-300 rounded-2xl p-8">
							<Image
								src="/hero.png"
								alt="YouTube Comment Analysis Dashboard"
								width={700} // set appropriate width
								height={700} // set appropriate height
								className="w-full h-auto rounded-lg shadow-lg"
							/>
						</div>
						{/* Floating Elements */}
						<div className="absolute top-4 -right-4 bg-white rounded-lg shadow-lg p-3 border border-neutral-300">
							<div className="flex items-center space-x-2">
								<div className="w-3 h-3 bg-green-500 rounded-full"></div>
								<span className="md:text-lg text-sm font-medium">
									78% Positive
								</span>
							</div>
						</div>
						<div className="absolute bottom-6 border border-neutral-300 -left-4 bg-white rounded-lg shadow-lg p-3">
							<div className="flex items-center space-x-2">
								<div className="w-3 h-3 bg-violet-500 rounded-full"></div>
								<span className="md:text-lg text-sm font-medium">
									234 Comments Analyzed
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
