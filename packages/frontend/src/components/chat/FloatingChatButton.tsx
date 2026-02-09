import { MessageCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FloatingChatButtonProps {
  onClick: () => void
  isOpen: boolean
}

export default function FloatingChatButton({ onClick, isOpen }: FloatingChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50 rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110",
        "bg-gradient-to-r from-blue-600 to-purple-600 text-white",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      )}
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <MessageCircle className="h-6 w-6" />
      )}
    </button>
  )
}
