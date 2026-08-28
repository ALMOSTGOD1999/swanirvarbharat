import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MessageCircle, X, Send, Bot } from 'lucide-react'
import { cn } from '~/lib/utils'

type Message = {
  id: number
  role: 'bot' | 'user'
  text: string
}

const DUMMY_REPLY = 'I am under development, hope meet with you soon'

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ id: 1, role: 'bot', text: DUMMY_REPLY }])
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return

    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, role: 'user', text },
      { id: prev.length + 2, role: 'bot', text: DUMMY_REPLY },
    ])
    setInput('')
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 flex h-96 w-80 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border bg-primary px-4 py-3 text-primary-foreground">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/15">
                <Bot className="size-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold leading-tight">Swanirvar-Guide</p>
                <p className="text-xs text-primary-foreground/70">Online</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-primary-foreground/15"
                aria-label="Close chat"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-3 py-2 text-sm',
                      msg.role === 'user'
                        ? 'rounded-br-sm bg-primary text-primary-foreground'
                        : 'rounded-bl-sm bg-muted text-muted-foreground'
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-full bg-muted px-4 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
              />
              <button
                type="submit"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
                aria-label="Send message"
              >
                <Send className="size-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
        aria-label="Open Swanirvar-Guide chat"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </motion.button>
    </div>
  )
}
