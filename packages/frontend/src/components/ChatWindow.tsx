import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import MessageList from './MessageList'
import MessageInput from './MessageInput'

interface ChatWindowProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const windowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && windowRef.current) {
      windowRef.current.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      ref={windowRef}
      className={cn(
        "fixed bottom-24 right-6 z-40 w-[400px] h-[600px]",
        "bg-white rounded-lg shadow-2xl flex flex-col",
        "animate-in slide-in-from-bottom-4 duration-200"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div>
          <h2 className="text-lg font-semibold">ChatFlow Assistant</h2>
          <p className="text-sm text-blue-100">How can I help you today?</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-md transition-colors"
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <MessageInput />
      </div>
    </div>
  )
}
