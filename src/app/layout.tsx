import type React from "react";
import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

// TODO add better font
const publicSans = Public_Sans({ weight: ["400", "500", "600", "700"] });

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
			<body className={publicSans.className}>
				{children}
				<Toaster richColors />
			</body>
		</html>
	);
}
