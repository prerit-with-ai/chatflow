import { useState, KeyboardEvent } from 'react'
import { Send } from 'lucide-react'
import { useChatStore } from '@/lib/store'
import { sendMessage } from '@/lib/api'

export default function MessageInput() {
  const [input, setInput] = useState('')
  const { addMessage, setLoading, isLoading } = useChatStore()

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: input.trim(),
      timestamp: new Date(),
    }

    addMessage(userMessage)
    setInput('')
    setLoading(true)

    try {
      const response = await sendMessage(input.trim())

      const assistantMessage = {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content: response.message,
        timestamp: new Date(),
      }

      addMessage(assistantMessage)
    } catch (error) {
      const errorMessage = {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      addMessage(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex gap-2">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="flex-1 resize-none rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={2}
        disabled={isLoading}
      />
      <button
        onClick={handleSend}
        disabled={!input.trim() || isLoading}
        className="px-4 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        aria-label="Send message"
      >
        <Send className="h-5 w-5" />
      </button>
    </div>
  )
}
