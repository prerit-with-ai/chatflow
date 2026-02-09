import { Link2, MessageCircle, Zap } from 'lucide-react'

const steps = [
  {
    icon: Link2,
    number: '01',
    title: 'Connect Your Services',
    description: 'Add your Supabase, GitHub, or other service credentials. All stored encrypted in your secure vault.',
    color: 'blue',
  },
  {
    icon: MessageCircle,
    number: '02',
    title: 'Chat Naturally',
    description: 'Just describe what you want in plain English. "Create a project", "Query my database", "Get API keys" - AI understands.',
    color: 'purple',
  },
  {
    icon: Zap,
    number: '03',
    title: 'AI Automates Everything',
    description: 'ChatFlow executes the tasks through MCP servers. Multi-step workflows, complex operations - handled automatically.',
    color: 'pink',
  },
]

const colorClasses = {
  blue: 'from-blue-500 to-cyan-500',
  purple: 'from-purple-500 to-pink-500',
  pink: 'from-pink-500 to-rose-500',
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            How It
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-xl text-slate-600">
            Get started in 3 simple steps. No complicated setup, just add your credentials and start chatting.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 -translate-x-1/2" />

            {/* Steps */}
            <div className="space-y-16">
              {steps.map((step, index) => {
                const isEven = index % 2 === 0
                const colorGradient = colorClasses[step.color as keyof typeof colorClasses]

                return (
                  <div
                    key={index}
                    className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                      isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    }`}
                  >
                    {/* Content */}
                    <div className={`flex-1 ${isEven ? 'lg:text-right lg:pr-12' : 'lg:text-left lg:pl-12'}`}>
                      <div className="inline-block">
                        <div className={`text-8xl font-bold bg-gradient-to-r ${colorGradient} bg-clip-text text-transparent opacity-20 mb-2`}>
                          {step.number}
                        </div>
                        <h3 className="text-2xl font-semibold mb-3 text-slate-900">
                          {step.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Icon (center on desktop) */}
                    <div className="relative z-10">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${colorGradient} flex items-center justify-center shadow-lg`}>
                        <step.icon className="h-10 w-10 text-white" />
                      </div>
                      {/* Glow effect */}
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${colorGradient} opacity-20 blur-xl`} />
                    </div>

                    {/* Spacer for even layout */}
                    <div className="flex-1 hidden lg:block" />
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <p className="text-slate-600 mb-6">
              Ready to automate your workflows?
            </p>
            <a
              href="/app"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              Start Automating Now
              <Zap className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
