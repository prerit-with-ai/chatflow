import { Bot, Shield, Zap, Puzzle } from 'lucide-react'

const features = [
  {
    icon: Bot,
    title: 'Multi-Provider AI',
    description: 'Choose between Claude, GPT-4, or Gemini. Switch providers with a single config change. Your choice, your control.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Shield,
    title: 'Secure Credential Vault',
    description: 'AES-256 encrypted storage for all your API keys and secrets. Never expose credentials in chat or logs.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Natural Language Control',
    description: 'Just chat to automate. "Create a project", "Query my database", "Get API keys" - AI understands and executes.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Puzzle,
    title: 'MCP Integration',
    description: 'Built on Model Context Protocol. Connect to any service through standard MCP servers. Extensible and future-proof.',
    gradient: 'from-green-500 to-emerald-500',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Everything You Need to
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Automate Smarter
            </span>
          </h2>
          <p className="text-xl text-slate-600">
            Powerful features designed for developers who value flexibility, security, and efficiency.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl bg-slate-50 hover:bg-white border-2 border-slate-100 hover:border-slate-200 transition-all duration-300 hover:shadow-xl"
            >
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-5`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-semibold mb-3 text-slate-900">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
