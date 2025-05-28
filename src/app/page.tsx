import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import Image from "next/image"

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
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-violet-600">InsAight</h2>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth">
                <Button variant="ghost" className="text-gray-600 hover:text-violet-600">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth">
                <Button className="bg-violet-600 hover:bg-violet-700 text-white">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Unlock Your YouTube Video's <span className="text-violet-600">Full Potential</span> with AI-Powered
                Comment Analysis
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Transform overwhelming comment sections into actionable insights. Understand your audience sentiment,
                discover content ideas, and grow your channel faster.
              </p>
              <Link href="/auth">
                <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 text-lg">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl p-8">
                <Image
                  src="/hero.png"
                  alt="YouTube Comment Analysis Dashboard"
                  width={600} // set appropriate width
                  height={400} // set appropriate height
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
              {/* Floating Elements */}
              <div className="absolute top-4 -right-4 bg-white rounded-lg shadow-lg p-3 border border-neutral-300">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="md:text-lg text-sm font-medium">78% Positive</span>
                </div>
              </div>
              <div className="absolute bottom-6 border border-neutral-300 -left-4 bg-white rounded-lg shadow-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
                  <span className="md:text-lg text-sm font-medium">234 Comments Analyzed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Loved by Content Creators</h2>
            <p className="text-xl text-gray-600">See what creators are saying about InsAight</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <Avatar className="w-10 h-10 mr-3">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback>
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">YouTube Creator</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-violet-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Transform Your Comment Analysis?</h2>
          <p className="text-xl text-violet-100 mb-8">
            Join thousands of creators who are already using InsAight to grow their channels
          </p>
          <Link href="/auth">
            <Button size="lg" className="bg-white text-violet-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Start Analyzing Comments
            </Button>
          </Link>
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
