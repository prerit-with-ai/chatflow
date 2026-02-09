import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pt-20 pb-32">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Automation Platform</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Automate Your Workflows
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              With Natural Language
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Chat with AI to create projects, manage databases, and automate tasks across Supabase, GitHub, and more. No code required.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Link
              to="/app"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-700 rounded-lg font-semibold text-lg hover:bg-slate-50 transition-colors border-2 border-slate-200"
            >
              See How It Works
            </a>
          </div>

          {/* Social proof / stats */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-600 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Multi-Provider AI</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>Secure & Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span>Open Source</span>
            </div>
          </div>
        </div>

        {/* Hero image/demo placeholder */}
        <div className="max-w-5xl mx-auto mt-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 border-b border-slate-200">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 text-center text-sm text-slate-600">
                chatflow.ai
              </div>
            </div>
            {/* Screenshot placeholder */}
            <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <p className="text-slate-600 font-medium">
                  Chat interface preview
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  "Create a Supabase project called 'blog'"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
