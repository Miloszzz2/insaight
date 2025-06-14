import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "InsAight - AI-Powered YouTube Comment Analysis",
	description:
		"Transform your YouTube comments into actionable insights with AI-powered sentiment analysis and smart categorization.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="antialiased">
			<body className={inter.className}>
				{children}
				<Toaster richColors />
			</body>
		</html>
	);
}
