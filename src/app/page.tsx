'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Trash2, Brain, Zap, AlertCircle, RefreshCw } from 'lucide-react'
import ChatLayout from './components/chatLayout'
import ChatHome from './components/chatHome';
import ActiveChat from './components/activeChat';

interface Source {
  text: string
  source: string
  page: number
  section: string
  rerank_score?: number
  keyword_matches?: number
}

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  sources?: Record<string, Source>  // sourceId -> Source mapping
  all_sources?: Record<string, Source>
  tool_calls?: ToolCall[]
  rounds?: number
  isStreaming?: boolean
  error?: string
}

interface ToolCall {
  tool: string
  args: Record<string, unknown> | null
  result_preview: string
}

interface ChatResponse {
  reply: string
  sources: Record<string, Source>
  all_sources: Record<string, Source>
  tool_calls: ToolCall[]
  rounds: number
}

interface StreamEvent {
  type: 'tool_call' | 'tool_result' | 'thinking' | 'answer' | 'sources' | 'done'
  tool?: string
  args?: Record<string, unknown> | null
  preview?: string
  content?: string
  sources?: Record<string, Source>
  note?: string
}

interface chatConversation {
  id: string
  messages: Message[]
  created_at: Date
  updated_at: Date
}

interface StoredMessage extends Omit<Message, 'timestamp'> {
  timestamp: string
}

interface StoredConversation extends Omit<chatConversation, 'created_at' | 'updated_at' | 'messages'> {
  created_at: string
  updated_at: string
  messages: StoredMessage[]
}

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

const sanitiseAssistantContent = (content: string): string =>
  content
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<\/?think>/gi, '')
    .trim()

// Enhanced agentic RAG chatbot
const callChatAPI = async (
  message: string,
  history: Array<{ role: string; content: string }>,
  country: string = ""
): Promise<ChatResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        namespace: "my-course",
        country,
        history,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Streaming agentic chat API
const callStreamingChatAPI = async (
  message: string,
  history: Array<{ role: string; content: string }>,
  onEvent: (event: StreamEvent) => void,
  onError: (error: Error) => void,
  country: string = ""
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        namespace: "my-course",
        country,
        history,
      }),
    })

    if (!response.ok) {
      throw new Error(`Streaming API request failed: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('No response body reader available')
    }

    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep the last incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const eventData = JSON.parse(line.slice(6))
              onEvent(eventData)
            } catch (parseError) {
              console.warn('Failed to parse SSE event:', line, parseError)
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  } catch (error) {
    console.error('Streaming API Error:', error)
    onError(error instanceof Error ? error : new Error('Unknown streaming error'))
  }
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [useStreaming, setUseStreaming] = useState(true) // Default to streaming for better UX
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState<Message | null>(null)
  const [currentToolCalls, setCurrentToolCalls] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [chatConversations, setChatConversations] = useState<chatConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('')
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const media = window.matchMedia("(max-width: 768px)");
    const updateIsMobile = () => setIsMobile(media.matches);

    updateIsMobile();

    if (media.addEventListener) {
      media.addEventListener("change", updateIsMobile)
    } else {
      media.addListener(updateIsMobile)
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", updateIsMobile)
      } else {
        media.removeListener(updateIsMobile)
      }
    };
  }, []);

  // Load chat conversations from localStorage on mount
  useEffect(() => {
    const storedConversations = localStorage.getItem('chatConversations')
    if (storedConversations) {
      try {
        const parsed = JSON.parse(storedConversations) as StoredConversation[]
        // Convert date strings back to Date objects
        const conversations = parsed.map((conv) => ({
          ...conv,
          created_at: new Date(conv.created_at),
          updated_at: new Date(conv.updated_at),
          messages: conv.messages.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }))
        setChatConversations(conversations)
      } catch (error) {
        console.error('Failed to load conversations:', error)
      }
    }
  }, [])

  // Save current conversation to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 1 && currentConversationId) { // Only save if there are actual messages beyond the intro
      setChatConversations(prevConversations => {
        const existingConversation = prevConversations.find(conv => conv.id === currentConversationId)

        const updatedConversations = existingConversation
          ? prevConversations.map(conv =>
              conv.id === currentConversationId
                ? { ...conv, messages, updated_at: new Date() }
                : conv
            )
          : [
              {
                id: currentConversationId,
                messages,
                created_at: new Date(),
                updated_at: new Date()
              },
              ...prevConversations
            ]

        localStorage.setItem('chatConversations', JSON.stringify(updatedConversations))

        return updatedConversations
      })
    }
  }, [messages, currentConversationId])

  // Clear localStorage when user leaves or refreshes
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('chatConversations')
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentStreamingMessage])

  // Check backend health on component mount
  useEffect(() => {
    checkBackendHealth()
  }, [])

  // Handler to start a new conversation
  const handleNewConversation = () => {
    setMessages([])
    setCurrentConversationId(null)
    setInputMessage('')
  }

  // Handler to load a previous conversation
  const handleLoadConversation = (conversationId: string) => {
    const conversation = chatConversations.find(conv => conv.id === conversationId)
    if (conversation) {
      setMessages(conversation.messages)
      setCurrentConversationId(conversationId)
    }
  }

  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`)
      if (response.ok) {
        setBackendStatus('online')
      } else {
        setBackendStatus('offline')
      }
    } catch (error) {
      setBackendStatus('offline')
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return

    const activeConversationId = currentConversationId ?? Date.now().toString()
    if (!currentConversationId) {
      setCurrentConversationId(activeConversationId)
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    }

    // Build multi-turn history from prior messages (skip the initial bot greeting)
    const history: Array<{ role: string; content: string }> = messages
      .filter(msg => msg.content && !msg.isStreaming && !msg.error)
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }))

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputMessage
    setInputMessage('')
    setIsTyping(true)
    setCurrentToolCalls([])

    try {
      if (useStreaming) {
        // Streaming agentic mode
        const streamingMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: '',
          sender: 'bot',
          timestamp: new Date(),
          sources: {},
          all_sources: {},
          tool_calls: [],
          isStreaming: true,
        }

        setCurrentStreamingMessage(streamingMessage)
        setMessages(prev => [...prev, streamingMessage])

        let answerContent = ''
        let sources: Record<string, Source> = {}
        const toolCalls: ToolCall[] = []
        let streamUpdateQueued = false

        const flushStreamingContent = (force = false) => {
          const applyUpdate = () => {
            setMessages(prev => prev.map(msg =>
              msg.id === streamingMessage.id ? {
                ...msg,
                content: sanitiseAssistantContent(answerContent)
              } : msg
            ))
          }

          if (force) {
            streamUpdateQueued = false
            applyUpdate()
            return
          }

          if (streamUpdateQueued) return
          streamUpdateQueued = true
          requestAnimationFrame(() => {
            streamUpdateQueued = false
            applyUpdate()
          })
        }

        await callStreamingChatAPI(
          currentInput,
          history,
          (event: StreamEvent) => {

            switch (event.type) {
              case 'tool_call':
                // Show which tool is being called
                setCurrentToolCalls(prev => [...prev, `${event.tool}(${JSON.stringify(event.args)})`])
                toolCalls.push({
                  tool: event.tool || '',
                  args: event.args ?? null,
                  result_preview: ''
                })
                break

              case 'tool_result':
                // Update the latest tool call with results
                if (toolCalls.length > 0) {
                  toolCalls[toolCalls.length - 1].result_preview = event.preview || ''
                }
                setMessages(prev => prev.map(msg =>
                  msg.id === streamingMessage.id ? {
                    ...msg,
                    tool_calls: [...toolCalls]
                  } : msg
                ))
                break

              case 'thinking':
                // Do not surface internal model reasoning in the UI
                break

              case 'answer':
                if (event.content) {
                  answerContent += event.content
                  flushStreamingContent()
                }
                break

              case 'sources':
                sources = event.sources || {}
                console.log('[SSE] sources event received:', Object.keys(sources).length, 'sources, keys:', Object.keys(sources))
                setMessages(prev => prev.map(msg =>
                  msg.id === streamingMessage.id ? {
                    ...msg,
                    sources: sources,
                    all_sources: sources
                  } : msg
                ))
                break

              case 'done':
                console.log('[SSE] done event, sources at this point:', Object.keys(sources).length)
                flushStreamingContent(true)
                setMessages(prev => {
                  const updated = prev.map(msg =>
                    msg.id === streamingMessage.id ? {
                      ...msg,
                      sources: sources,
                      all_sources: sources,
                      isStreaming: false
                    } : msg
                  )
                  console.log('[SSE] final message sources:', updated.find(m => m.id === streamingMessage.id)?.sources ? Object.keys(updated.find(m => m.id === streamingMessage.id)!.sources!).length : 0)
                  return updated
                })
                setCurrentToolCalls([])
                break
            }
          },
          (error: Error) => {
            // Handle streaming error
            const errorMessage: Message = {
              id: (Date.now() + 2).toString(),
              content: "I apologise, but I encountered an error during the search process. Please try again.",
              sender: 'bot',
              timestamp: new Date(),
              error: error.message,
            }
            setMessages(prev => [...prev.slice(0, -1), errorMessage]) // Replace streaming message with error
            setCurrentStreamingMessage(null)
            setCurrentToolCalls([])
            setBackendStatus('offline')
          },
          selectedCountry
        )

        setCurrentStreamingMessage(null)

      } else {
        // Non-streaming mode
        const response = await callChatAPI(currentInput, history, selectedCountry)

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: sanitiseAssistantContent(response.reply),
          sender: 'bot',
          timestamp: new Date(),
          sources: response.sources,
          all_sources: response.all_sources,
          tool_calls: response.tool_calls,
          rounds: response.rounds,
        }

        setMessages(prev => [...prev, botMessage])
      }

      // Update backend status to online since request succeeded
      if (backendStatus !== 'online') {
        setBackendStatus('online')
      }

    } catch (error) {
      // Create error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: backendStatus === 'offline'
          ? "I'm sorry, I can't connect to the backend service. Please make sure the API server is running on http://127.0.0.1:8000"
          : "I apologise, but I encountered an error while processing your request. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      }

      setMessages(prev => [...prev, errorMessage])
      setBackendStatus('offline')
      setCurrentStreamingMessage(null)
      setCurrentToolCalls([])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  const StatusIndicator = () => (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${backendStatus === 'online' ? 'bg-green-400 animate-pulse' :
          backendStatus === 'offline' ? 'bg-red-400' :
            'bg-yellow-400 animate-pulse'
        }`} />
      <span className="text-xs text-gray-400">
        {backendStatus === 'online' ? 'Connected to Backend' :
          backendStatus === 'offline' ? 'Backend Offline' :
            'Checking connection...'}
      </span>
    </div>
  )
  console.log("Messages", messages);

  return (

    <ChatLayout
      chatConversations={chatConversations}
      currentConversationId={currentConversationId}
      onNewConversation={handleNewConversation}
      onLoadConversation={handleLoadConversation}
      onCountryChange={setSelectedCountry}
    >
      {messages.length === 0 ?
        (<ChatHome
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          handleKeyPress={handleKeyPress}
        />) :
        <ActiveChat
          isMobile={isMobile}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          messages={messages.map(msg => ({
            id: msg.id,
            message: msg.content,
            sender: msg.sender,
            timestamp: msg.timestamp,
            sources: msg.sources || {},
            all_sources: msg.all_sources,
            tool_calls: msg.tool_calls || [],
            rounds: msg.rounds || 0,
            isStreaming: msg.isStreaming || false,
            error: msg.error || '',
          }))}
          isResponding={isTyping}
          handleKeyPress={handleKeyPress}
          handleSendMessage={handleSendMessage} />}

      {/* backend status indicator */}
      {backendStatus === 'offline' && (
        <div className="mt-3 p-3 bg-red-600/10 border border-red-600/30 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-400">
            Backend service is offline. Please ensure your FastAPI server is running on port 8000.
          </span>
        </div>
      )}
    </ChatLayout>


    // <div className="flex h-screen bg-gray-900">
    //   <div className="flex flex-col w-full max-w-4xl mx-auto bg-gray-800 border-x border-gray-700">
    //     {/* Minimal Header */}
    //     <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
    //       <div className="flex items-center space-x-3">
    //         <div className="p-2 bg-gray-800 rounded-lg">
    //           <Brain className="w-5 h-5 text-gray-300" />
    //         </div>
    //         <div>
    //           <h1 className="text-2xl font-bold text-white">
    //             Project X
    //           </h1>
    //           <p className="text-gray-300 text-sm">Intelligent Medical Research Assistant</p>
    //         </div>
    //       </div>
    //       <div className="flex items-center space-x-3">
    //         <StatusIndicator />
    //         <button
    //           onClick={checkBackendHealth}
    //           className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
    //           title="Refresh connection"
    //         >
    //           <RefreshCw className="w-4 h-4" />
    //         </button>
    //         <button
    //           onClick={clearChat}
    //           className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
    //           title="Clear chat"
    //         >
    //           <Trash2 className="w-4 h-4" />
    //         </button>
    //       </div>
    //     </div>

    //     {/* Messages */}
    //     <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
    //       {messages.map((message) => (
    //         <div key={message.id} className="group">
    //           <div
    //             className={`flex ${
    //               message.sender === 'user' ? 'justify-end' : 'justify-start'
    //             }`}
    //           >
    //             <div
    //               className={`flex items-start space-x-3 max-w-4xl ${
    //                 message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
    //               }`}
    //             >
    //               <div
    //                 className={`p-2 rounded-full ${
    //                   message.sender === 'user'
    //                     ? 'bg-blue-600 text-white'
    //                     : message.error 
    //                     ? 'bg-red-600 text-white'
    //                     : 'bg-gray-700 text-gray-300'
    //                 }`}
    //               >
    //                 {message.sender === 'user' ? (
    //                   <User className="w-5 h-5" />
    //                 ) : message.error ? (
    //                   <AlertCircle className="w-5 h-5" />
    //                 ) : (
    //                   <Bot className="w-5 h-5" />
    //                 )}
    //               </div>
    //               <div
    //                 className={`p-3 rounded-lg border ${
    //                   message.sender === 'user'
    //                     ? 'bg-blue-600 text-white border-blue-500'
    //                     : message.error
    //                     ? 'bg-red-600/10 text-red-300 border-red-600'
    //                     : 'bg-gray-800 text-gray-100 border-gray-700'
    //                 }`}
    //               >
    //                 {/* Main content with enhanced citation formatting */}
    //                 <div className="whitespace-pre-wrap leading-relaxed">
    //                   {message.content.split(/(\[[a-f0-9]{4}\])/g).map((part, index) => {
    //                     const sourceMatch = part.match(/\[([a-f0-9]{4})\]/)
    //                     if (sourceMatch && message.sources && message.sources[sourceMatch[1]]) {
    //                       const sourceId = sourceMatch[1]
    //                       const source = message.sources[sourceId]
    //                       return (
    //                         <span
    //                           key={index}
    //                           className="inline-flex items-center px-1.5 py-0.5 bg-blue-600/20 text-blue-300 text-xs rounded border border-blue-600/30 cursor-pointer hover:bg-blue-600/30 transition-colors"
    //                           onClick={() => {
    //                             // Scroll to corresponding source card
    //                             const sourceCard = document.getElementById(`source-${message.id}-${sourceId}`)
    //                             sourceCard?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    //                           }}
    //                           title={`${source.source} - Page ${source.page}`}
    //                         >
    //                           {part}
    //                         </span>
    //                       )
    //                     }
    //                     return part
    //                   })}
    //                 </div>

    //                 {/* Show tool calls if available */}
    //                 {message.tool_calls && message.tool_calls.length > 0 && (
    //                   <div className="mt-3 p-3 bg-gray-900 rounded-lg border-l-4 border-green-500">
    //                     <div className="flex items-center space-x-2 mb-2">
    //                       <Brain className="w-4 h-4 text-green-400" />
    //                       <span className="text-sm font-medium text-green-400">
    //                         Research Process ({message.tool_calls.length} searches{message.rounds ? `, ${message.rounds} rounds` : ''})
    //                       </span>
    //                     </div>
    //                     <div className="space-y-2 text-sm text-gray-300">
    //                       {message.tool_calls.map((call, index) => (
    //                         <div key={index} className="flex items-start space-x-2">
    //                           <span className="text-green-300 font-mono text-xs mt-1">{index + 1}.</span>
    //                           <div className="flex-1">
    //                             <span className="text-yellow-300 font-medium">{call.tool}</span>
    //                             <span className="text-gray-400">({JSON.stringify(call.args)})</span>
    //                             {call.result_preview && (
    //                               <p className="text-xs text-gray-400 mt-1 italic">
    //                                 → {call.result_preview.slice(0, 100)}...
    //                               </p>
    //                             )}
    //                           </div>
    //                         </div>
    //                       ))}
    //                     </div>
    //                   </div>
    //                 )}

    //                 {/* Enhanced Sources Display */}
    //                 {message.sources && Object.keys(message.sources).length > 0 && (
    //                   <div className="mt-3">
    //                     <div className="space-y-3">
    //                       <div className="flex items-center space-x-2">
    //                         <Zap className="w-4 h-4 text-blue-400" />
    //                         <span className="text-sm font-medium text-blue-400">
    //                           Sources Found ({Object.keys(message.sources).length})
    //                         </span>
    //                       </div>
    //                       <div className="space-y-2">
    //                         {Object.entries(message.sources).map(([sourceId, source]) => (
    //                           <div 
    //                             key={sourceId} 
    //                             id={`source-${message.id}-${sourceId}`}
    //                             className="bg-gray-900 p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
    //                           >
    //                             <div className="flex items-center justify-between mb-2">
    //                               <div className="flex items-center space-x-2">
    //                                 <span className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded font-mono">
    //                                   [{sourceId}]
    //                                 </span>
    //                                 <span className="text-xs text-gray-400">
    //                                   {source.source} {source.page > 0 && `• Page ${source.page}`}
    //                                 </span>
    //                               </div>
    //                               <div className="flex items-center space-x-2 text-xs text-gray-500">
    //                                 {source.rerank_score && (
    //                                   <span>Relevance: {(source.rerank_score * 100).toFixed(1)}%</span>
    //                                 )}
    //                                 {source.keyword_matches && (
    //                                   <span>Keywords: {source.keyword_matches}</span>
    //                                 )}
    //                               </div>
    //                             </div>
    //                             {source.section && (
    //                               <div className="text-xs text-blue-300 mb-1 font-medium">
    //                                 Section: {source.section}
    //                               </div>
    //                             )}
    //                             <p className="text-sm text-gray-300 leading-relaxed">
    //                               {source.text.length > 400 ? `${source.text.slice(0, 400)}...` : source.text}
    //                             </p>
    //                           </div>
    //                         ))}
    //                       </div>
    //                     </div>
    //                   </div>
    //                 )}

    //                 <p
    //                   className={`text-xs mt-2 ${
    //                     message.sender === 'user'
    //                       ? 'text-blue-200'
    //                       : 'text-gray-500'
    //                   }`}
    //                 >
    //                   {message.timestamp.toLocaleTimeString()}
    //                   {message.isStreaming && (
    //                     <span className="ml-2 text-blue-400">• Streaming...</span>
    //                   )}
    //                 </p>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       ))}

    //       {/* Enhanced Typing indicator */}
    //       {isTyping && (
    //         <div className="flex justify-start">
    //           <div className="flex items-start space-x-3 max-w-4xl">
    //             <div className="p-2 bg-gray-700 text-gray-300 rounded-full">
    //               <Bot className="w-4 h-4" />
    //             </div>
    //             <div className="p-3 bg-gray-800 border border-gray-700 rounded-lg">
    //               <div className="flex items-center space-x-2">
    //                 <div className="flex space-x-1">
    //                   <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
    //                   <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
    //                   <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    //                 </div>
    //                 <span className="text-sm text-blue-400 ml-2">
    //                   {useStreaming ? 'AI agent researching...' : 'Processing your question...'}
    //                 </span>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       )}
    //       <div ref={messagesEndRef} />
    //     </div>

    //     {/* Enhanced Input */}
    //     <div className="p-4 bg-gray-800 border-t border-gray-700">
    //       {/* Mode Toggle */}
    //       <div className="flex items-center justify-between mb-3">
    //         <div className="flex items-center space-x-4">
    //           <button
    //             onClick={() => setUseStreaming(!useStreaming)}
    //             className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all text-sm ${
    //               useStreaming 
    //                 ? 'bg-blue-600 text-white' 
    //                 : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    //             }`}
    //           >
    //             <Zap className="w-4 h-4" />
    //             <span>Live Stream</span>
    //           </button>

    //           <span className="text-xs text-gray-400">
    //             {useStreaming ? 'Watch AI research in real-time' : 'Get complete results instantly'}
    //           </span>
    //         </div>

    //         {/* Show active tool calls during streaming */}
    //         {currentToolCalls.length > 0 && (
    //           <div className="flex items-center space-x-2">
    //             <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
    //             <span className="text-xs text-yellow-400">
    //               Searching: {currentToolCalls[currentToolCalls.length - 1]}
    //             </span>
    //           </div>
    //         )}
    //       </div>

    //       <div className="flex space-x-3">
    //         <input
    //           type="text"
    //           value={inputMessage}
    //           onChange={(e) => setInputMessage(e.target.value)}
    //           onKeyPress={handleKeyPress}
    //           placeholder={backendStatus === 'offline' ? "Backend offline - check connection..." : "Ask me a medical research question..."}
    //           className="flex-1 p-3 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 disabled:opacity-50"
    //           disabled={isTyping || backendStatus === 'offline'}
    //         />
    //         <button
    //           onClick={handleSendMessage}
    //           disabled={!inputMessage.trim() || isTyping || backendStatus === 'offline'}
    //           className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    //         >
    //           <Send className="w-4 h-4" />
    //         </button>
    //       </div>

    //       {backendStatus === 'offline' && (
    //         <div className="mt-3 p-3 bg-red-600/10 border border-red-600/30 rounded-lg flex items-center space-x-2">
    //           <AlertCircle className="w-4 h-4 text-red-400" />
    //           <span className="text-sm text-red-400">
    //             Backend service is offline. Please ensure your FastAPI server is running on port 8000.
    //           </span>
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </div>
  )
}
