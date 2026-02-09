import { Database, GitBranch, Key, MessageSquare } from 'lucide-react'

const useCases = [
  {
    icon: Database,
    title: 'Create Supabase Projects',
    userMessage: '"Create a Supabase project called \'blog\' with a posts table"',
    aiResponse: 'Creating your Supabase project... ✓ Project created! I\'ve also set up the posts table and saved your API keys to the vault.',
    color: 'blue',
  },
  {
    icon: GitBranch,
    title: 'Manage GitHub Repositories',
    userMessage: '"Create a new GitHub repo for my portfolio and add a README"',
    aiResponse: 'Repository created at github.com/you/portfolio ✓ I\'ve added a README with a starter template. Ready to push your code!',
    color: 'purple',
  },
  {
    icon: Key,
    title: 'Secure Credential Management',
    userMessage: '"Save these API keys for my production environment"',
    aiResponse: 'Credentials encrypted and stored ✓ You can retrieve them anytime by asking "Get my production keys".',
    color: 'green',
  },
  {
    icon: MessageSquare,
    title: 'Query Your Data',
    userMessage: '"Show me the 10 most recent users from my database"',
    aiResponse: 'Here are your recent users: [displays formatted table]. Would you like to export this or filter by specific criteria?',
    color: 'orange',
  },
]

const colorClasses = {
  blue: {
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-600',
  },
  purple: {
    gradient: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-600',
  },
  green: {
    gradient: 'from-green-500 to-emerald-500',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-600',
  },
  orange: {
    gradient: 'from-orange-500 to-red-500',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-600',
  },
}

export default function UseCases() {
  return (
    <section id="use-cases" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            See ChatFlow
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              In Action
            </span>
          </h2>
          <p className="text-xl text-slate-600">
            Real examples of how developers use ChatFlow to automate their daily tasks.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {useCases.map((useCase, index) => {
            const colors = colorClasses[useCase.color as keyof typeof colorClasses]
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${colors.gradient}`}>
                    <useCase.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {useCase.title}
                  </h3>
                </div>

                {/* Chat simulation */}
                <div className="space-y-4">
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3">
                      <p className="text-sm">{useCase.userMessage}</p>
                    </div>
                  </div>

                  {/* AI response */}
                  <div className="flex justify-start">
                    <div className={`max-w-[85%] ${colors.bg} border ${colors.border} rounded-2xl rounded-tl-sm px-4 py-3`}>
                      <p className="text-sm text-slate-700">{useCase.aiResponse}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
