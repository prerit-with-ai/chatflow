import { useState } from 'react'
import FloatingChatButton from './components/FloatingChatButton'
import ChatWindow from './components/ChatWindow'

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Demo landing page content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ChatFlow
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            AI-Powered Service Integration Assistant
          </p>
          <p className="text-slate-500 mb-12">
            Automate your workflows with natural language. Create Supabase projects, manage GitHub repos, and more - all through conversation.
          </p>
          <div className="bg-white rounded-lg shadow-md p-8 text-left">
            <h2 className="text-2xl font-semibold mb-4">Try it now</h2>
            <p className="text-slate-600 mb-4">
              Click the chat button in the bottom-right corner to get started. Try asking:
            </p>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>"Create a Supabase project called 'my-app'"</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>"Show me my saved API keys"</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>"Help me set up a new project"</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <FloatingChatButton onClick={() => setIsChatOpen(!isChatOpen)} isOpen={isChatOpen} />
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}

export default App
