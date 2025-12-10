import React, { useState, useRef, useEffect } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { SendHorizontal, Trash, Bot, User, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useChatbot } from '@/components/contexts/ChatContext'
import { chatContext } from '@/components/config/chatContext'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const Chat: React.FC = () => {
  const { isVisible } = useChatbot()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fix for Vite env import typing issue:
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_API_KEY || ''
  const hasApiKey = Boolean(apiKey && apiKey.trim().length > 0)

  // Debug logging
  console.log('API Key loaded:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND')
  console.log('Has API Key:', hasApiKey)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    if (!hasApiKey) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            'Chat is disabled because no API key is configured. Please set VITE_GOOGLE_API_KEY and reload.',
          timestamp: new Date(),
        },
      ])
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      const candidateModels = [
        'gemini-2.0-flash',
      ]

      let responseText = ''
      let lastError: unknown = null

      for (const modelId of candidateModels) {
        try {
          const model = genAI.getGenerativeModel({ model: modelId })
          const chat = model.startChat({
            history: [
              {
                role: 'user',
                parts: [{ text: chatContext }],
              },
              {
                role: 'model',
                parts: [{ text: 'I understand the context and will use it to provide accurate responses.' }],
              },
              ...messages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }],
              })),
            ],
          })

          const result = await chat.sendMessage(input.trim())
          const response = await result.response
          responseText = response.text()
          // success, break out
          break
        } catch (err: any) {
          lastError = err
          const msg: string = err?.message || ''
          // If this model isn't available/supported, try the next one
          if (
            msg.includes('not found') ||
            msg.includes('is not supported') ||
            msg.includes('404')
          ) {
            continue
          }
          // Other errors should stop the loop
          throw err
        }
      }

      if (!responseText) {
        // No model succeeded; surface the last error message if any
        const msg = (lastError as any)?.message || 'No supported Gemini model available.'
        throw new Error(msg)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error: unknown) {
      console.error('Chat API Error:', error)
      const errorDetails = (error as any)?.message || 'Unknown error'
      console.error('Error details:', errorDetails)

      let errorMessage = 'Sorry, I encountered an error. Please try again.'

      if (errorDetails.includes('API key') || errorDetails.includes('authentication')) {
        errorMessage = 'API key issue: Please check your VITE_GOOGLE_API_KEY in .env file.'
      } else if (errorDetails.includes('quota') || errorDetails.includes('limit')) {
        errorMessage = 'API quota exceeded. Please try again later.'
      } else if (errorDetails.includes('network') || errorDetails.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection.'
      }

      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const clearMessages = () => {
    setMessages([])
  }

  const { toggleChatbot } = useChatbot()

  if (isVisible) return null

  return (
    <div className="fixed bottom-20 right-4 z-20 w-80">
      <Card className="h-[400px] flex flex-col"> {/* Increased height */}
        <CardHeader className="pb-3 shrink-0"> {/* Added shrink-0 */}

          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="size-7" />
            Support IA
            <div className="flex  space-x-1 ml-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChatbot}
                title="Toggle chatbot"
              >
                <X className="size-4" />

              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 min-h-0"> {/* Added min-h-0 */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 scroll-smooth">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm">
                <p>Hi! I'm your AI assistant.</p>
                <p>Ask me anything about the EDUMANAGE platform!</p>
                {!hasApiKey && (
                  <p className="text-amber-600 mt-2 text-xs">
                    Demo mode - Add VITE_GOOGLE_API_KEY for full AI functionality
                  </p>
                )}
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-2',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'flex gap-2 max-w-[80%]',
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    )}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      {message.role === 'user' ? (
                        <User className="size-4" />
                      ) : (
                        <Bot className="size-4" />
                      )}
                    </div>
                    <div
                      className={cn(
                        'rounded-lg px-3 py-2 text-sm',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Bot className="size-4" />
                </div>
                <div className="rounded-lg bg-muted px-3 py-2 text-sm">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="flex gap-1 border-t p-2 shrink-0"> {/* Added shrink-0 */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearMessages}
              disabled={messages.length === 0}
              className="px-3"
            >
              <Trash className="size-4 text-rose-500" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!input.trim() || isLoading}
              className="px-3"
            >
              <SendHorizontal className="size-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Chat
