'use client'
import { useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Facebook, Instagram, Linkedin, MessageCircleDashedIcon, Music, ThumbsUp, Twitch, Twitter, Youtube } from "lucide-react"

const creatorLogos = [
   { name: "YouTube", logo: "🎥" },
   { name: "TikTok", logo: "🎵" },
   { name: "Instagram", logo: "📸" },
   { name: "Twitch", logo: "🎮" },
   { name: "Twitter", logo: "🐦" },
   { name: "LinkedIn", logo: "💼" },
   { name: "Facebook", logo: "📘" },
   { name: "Discord", logo: "💬" },
]

const testimonials = [
   {
      id: 1,
      name: "SARAH CHEN",
      handle: "@sarahcreates",
      avatar: "/placeholder.svg?height=60&width=60",
      content:
         "InsAight completely transformed how I understand my audience. The sentiment analysis helped me identify what content resonates most with my viewers.",
      category: "Content Strategy",
      verified: true,
   },
   {
      id: 2,
      name: "MIKE RODRIGUEZ",
      handle: "@miketech",
      avatar: "/placeholder.svg?height=60&width=60",
      content:
         "The AI categorization is incredible. It automatically groups feedback about editing, audio, and content ideas. Saves me hours of manual work every week.",
      category: "Time Saving",
      verified: true,
   },
   {
      id: 3,
      name: "EMMA WATSON",
      handle: "@emmavlogs",
      avatar: "/placeholder.svg?height=60&width=60",
      content:
         "I discovered so many content ideas from the suggestions category. My audience was literally telling me what they wanted to see next!",
      category: "Content Ideas",
      verified: true,
   },
   {
      id: 4,
      name: "ALEX JOHNSON",
      handle: "@alexgaming",
      avatar: "/placeholder.svg?height=60&width=60",
      content:
         "The sentiment tracking helped me understand which videos perform best emotionally. Now I can replicate that success in future content.",
      category: "Performance",
      verified: true,
   },
   {
      id: 5,
      name: "LISA PARK",
      handle: "@lisacooks",
      avatar: "/placeholder.svg?height=60&width=60",
      content:
         "InsAight's analysis revealed that my audience loved my cooking tips but wanted more behind-the-scenes content. Game changer for my channel strategy.",
      category: "Audience Insights",
      verified: true,
   },
   {
      id: 6,
      name: "DAVID SMITH",
      handle: "@davidfitness",
      avatar: "/placeholder.svg?height=60&width=60",
      content:
         "The negative sentiment analysis helped me identify and address concerns quickly. My community engagement has improved dramatically since using InsAight.",
      category: "Community",
      verified: true,
   },
   {
      id: 7,
      name: "MARIA GARCIA",
      handle: "@mariamusic",
      avatar: "/placeholder.svg?height=60&width=60",
      content:
         "I love how it breaks down feedback by category. The audio quality insights helped me invest in better equipment that my audience actually wanted.",
      category: "Equipment",
      verified: true,
   },
   {
      id: 8,
      name: "JAMES WILSON",
      handle: "@jamestravel",
      avatar: "/placeholder.svg?height=60&width=60",
      content:
         "InsAight showed me that viewers loved my editing style but wanted longer videos. The data-driven insights helped me optimize my content perfectly.",
      category: "Optimization",
      verified: true,
   },
   {
      id: 9,
      name: "RACHEL GREEN",
      handle: "@rachelart",
      avatar: "/placeholder.svg?height=60&width=60",
      content:
         "The AI summary feature gives me a quick overview of all feedback. I can spot trends and patterns in minutes instead of reading hundreds of comments.",
      category: "Efficiency",
      verified: true,
   },
]

export function CommentTestimonials() {
   const [scrollY, setScrollY] = useState(0)
   const sectionRef = useRef<HTMLDivElement>(null)

   useEffect(() => {
      const handleScroll = () => {
         if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect()
            const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight))
            setScrollY(scrollProgress * 100)
         }
      }

      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
   }, [])

   // Split testimonials into columns
   const column1 = testimonials.filter((_, index) => index % 3 === 0)
   const column2 = testimonials.filter((_, index) => index % 3 === 1)
   const column3 = testimonials.filter((_, index) => index % 3 === 2)

   return (
      <section className="bg-gray-900 py-20 overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16">
               <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-wide">
                  CREATORS BRING THEIR CONTENT TO LIFE WITH InsAight
               </h2>

               {/* Platform Logos */}
               <div className="flex flex-wrap justify-center items-center gap-8 mb-8 opacity-60" ref={sectionRef}>
                  {creatorLogos.map((platform, index) => (
                     <div key={index} className="flex items-center space-x-2 text-gray-400">
                        <span className="text-xl ">{platform.logo}</span>
                        <span className="text-sm font-medium hidden sm:inline">{platform.name}</span>
                     </div>
                  ))}
               </div>
            </div>

            {/* Testimonials Grid with Scroll Animation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {/* Column 1 - Moves up on scroll */}
               <div
                  className="space-y-6 transition-transform duration-300 ease-out"
                  style={{ transform: `translateY(-${scrollY * 0.5}px)` }}
               >
                  {column1.map((testimonial) => (
                     <div
                        key={testimonial.id}
                        className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105"
                     >
                        {/* User Header */}
                        <div className="flex items-center space-x-3 mb-4">
                           <Avatar className="w-12 h-12 border-2 border-gray-600">
                              <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                              <AvatarFallback className="bg-violet-600 text-white font-semibold">
                                 {testimonial.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                              </AvatarFallback>
                           </Avatar>
                           <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                 <h3 className="font-bold text-white text-sm truncate">{testimonial.name}</h3>
                                 {testimonial.verified && (
                                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                       <span className="text-white text-xs">✓</span>
                                    </div>
                                 )}
                              </div>
                              <p className="text-gray-400 text-sm">{testimonial.handle}</p>
                           </div>
                        </div>

                        {/* Testimonial Content */}
                        <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-4">{testimonial.content}</p>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                           <Badge variant="secondary" className="bg-violet-900/50 text-violet-300 border-violet-700 text-xs">
                              {testimonial.category}
                           </Badge>
                           <div className="flex items-center space-x-1 text-gray-400">
                              <ThumbsUp className="w-3 h-3" />
                              <span className="text-xs">{Math.floor(Math.random() * 50) + 10}</span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>

               {/* Column 2 - Static */}
               <div className="space-y-6">
                  {column2.map((testimonial) => (
                     <div
                        key={testimonial.id}
                        className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105"
                     >
                        {/* User Header */}
                        <div className="flex items-center space-x-3 mb-4">
                           <Avatar className="w-12 h-12 border-2 border-gray-600">
                              <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                              <AvatarFallback className="bg-violet-600 text-white font-semibold">
                                 {testimonial.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                              </AvatarFallback>
                           </Avatar>
                           <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                 <h3 className="font-bold text-white text-sm truncate">{testimonial.name}</h3>
                                 {testimonial.verified && (
                                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                       <span className="text-white text-xs">✓</span>
                                    </div>
                                 )}
                              </div>
                              <p className="text-gray-400 text-sm">{testimonial.handle}</p>
                           </div>
                        </div>

                        {/* Testimonial Content */}
                        <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-4">{testimonial.content}</p>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                           <Badge variant="secondary" className="bg-violet-900/50 text-violet-300 border-violet-700 text-xs">
                              {testimonial.category}
                           </Badge>
                           <div className="flex items-center space-x-1 text-gray-400">
                              <ThumbsUp className="w-3 h-3" />
                              <span className="text-xs">{Math.floor(Math.random() * 50) + 10}</span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>

               {/* Column 3 - Moves up on scroll */}
               <div
                  className="space-y-6 transition-transform duration-300 ease-out"
                  style={{ transform: `translateY(-${scrollY * 0.5}px)` }}
               >
                  {column3.map((testimonial) => (
                     <div
                        key={testimonial.id}
                        className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105"
                     >
                        {/* User Header */}
                        <div className="flex items-center space-x-3 mb-4">
                           <Avatar className="w-12 h-12 border-2 border-gray-600">
                              <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                              <AvatarFallback className="bg-violet-600 text-white font-semibold">
                                 {testimonial.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                              </AvatarFallback>
                           </Avatar>
                           <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                 <h3 className="font-bold text-white text-sm truncate">{testimonial.name}</h3>
                                 {testimonial.verified && (
                                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                       <span className="text-white text-xs">✓</span>
                                    </div>
                                 )}
                              </div>
                              <p className="text-gray-400 text-sm">{testimonial.handle}</p>
                           </div>
                        </div>

                        {/* Testimonial Content */}
                        <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-4">{testimonial.content}</p>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                           <Badge variant="secondary" className="bg-violet-900/50 text-violet-300 border-violet-700 text-xs">
                              {testimonial.category}
                           </Badge>
                           <div className="flex items-center space-x-1 text-gray-400">
                              <ThumbsUp className="w-3 h-3" />
                              <span className="text-xs">{Math.floor(Math.random() * 50) + 10}</span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Bottom Stats */}
            <div className="mt-16 pt-8 border-t border-gray-700">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div>
                     <div className="text-3xl font-bold text-white mb-2">10K+</div>
                     <div className="text-gray-400 text-sm">Creators Trust Us</div>
                  </div>
                  <div>
                     <div className="text-3xl font-bold text-violet-400 mb-2">2M+</div>
                     <div className="text-gray-400 text-sm">Comments Analyzed</div>
                  </div>
                  <div>
                     <div className="text-3xl font-bold text-green-400 mb-2">95%</div>
                     <div className="text-gray-400 text-sm">Accuracy Rate</div>
                  </div>
                  <div>
                     <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
                     <div className="text-gray-400 text-sm">AI Processing</div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}
