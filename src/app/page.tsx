import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CommentTestimonials } from "@/components/landing/comments-testimonial"
import { HeroSection } from "@/components/landing/hero-section"

export default function LandingPage() {
  const features = [
    {
      icon: "🎯",
      title: "Accurate Sentiment Analysis",
      description: "Understand your audience's true feelings with AI-powered sentiment detection",
    },
    {
      icon: "📊",
      title: "Smart Comment Grouping",
      description: "Automatically categorize comments by topics like editing, suggestions, and more",
    },
    {
      icon: "⚡",
      title: "Fast & Easy Analysis",
      description: "Get insights in seconds with just your YouTube login - no manual work required",
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Your data stays safe with us - we never share or store your personal information",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      quote: "This tool completely changed how I understand my audience. The sentiment analysis is spot-on!",
    },
    {
      name: "Mike Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      quote: "I love how it groups comments by topics. Makes it so easy to see what my viewers really want.",
    },
    {
      name: "Emma Thompson",
      avatar: "/placeholder.svg?height=40&width=40",
      quote: "Fast, accurate, and incredibly useful. This is now part of my regular content creation workflow.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <HeroSection />
      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Creators Love CommentAI</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you understand your audience and create better content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white border border-neutral-200 shadow-sm">
                <CardContent className="p-6 text-center ">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CommentTestimonials />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-violet-600 to-purple-600 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-bounce-slow"></div>

        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 animate-fade-in-up">
            Ready to Transform Your Comment Analysis?
          </h2>
          <p className="text-xl text-violet-100 mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Join thousands of creators who are already using CommentAI to grow their channels
          </p>
          <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Link href="/auth">
              <Button
                size="lg"
                className="bg-white text-violet-600 hover:bg-gray-100 px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group"
              >
                <span className="group-hover:animate-pulse">Start Analyzing Comments</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-violet-400 mb-4">InsAight</h3>
            <p className="text-gray-400 mb-4">AI-powered YouTube comment analysis for smarter content creation</p>
            <div className="text-sm text-gray-500">© 2025 InsAight. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
