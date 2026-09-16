"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Send, Sparkles, Loader2, Leaf, Droplets, Bug, TrendingUp, Zap, MessageCircle } from "lucide-react"
import { TopBar } from "@/components/ui/top-bar"

const QUICK_SUGGESTIONS = [
  { icon: Leaf, label: "Crop Care", prompt: "What are the best practices for growing wheat this season?" },
  { icon: Bug, label: "Pest Control", prompt: "How do I identify and control aphids on my crops?" },
  { icon: Droplets, label: "Irrigation", prompt: "Should I irrigate my tomato field today?" },
  { icon: TrendingUp, label: "Market Prices", prompt: "What are the current mandi prices for paddy?" },
]

export default function MitraPage() {
  const params = useSearchParams()
  const topic = params.get("topic")
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages = [], sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/mitra" }),
  })

  useEffect(() => {
    if (topic && Array.isArray(messages) && messages.length === 0) {
      sendMessage({ text: `Tell me more about: ${topic}` })
    }
  }, [topic, messages.length, sendMessage])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  function send(e?: React.FormEvent) {
    e?.preventDefault()
    if (!input.trim() || status === "submitted" || status === "streaming") return
    sendMessage({ text: input })
    setInput("")
  }

  const messageArray = Array.isArray(messages) ? messages : []

  return (
    <>
      <TopBar title="Krishi Mitra" showBack />
      <div className="flex flex-col h-[calc(100dvh-3.5rem-1px)] bg-gradient-to-b from-background to-background/95">
        {/* Chat Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          {messageArray.length === 0 ? (
            <div className="flex flex-col gap-6 flex-1 justify-start pt-6">
              {/* Welcome Section */}
              <div className="text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
                  <Sparkles className="size-8 text-primary" aria-hidden="true" />
                </div>
                <h1 className="text-2xl font-bold font-serif mb-2">Welcome to Krishi Mitra</h1>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                  Your personal AI farming advisor. Ask me anything about crops, weather, pests, prices, or government schemes in any Indian language.
                </p>
              </div>

              {/* Quick Suggestions Grid */}
              <div className="grid grid-cols-2 gap-3">
                {QUICK_SUGGESTIONS.map(({ icon: Icon, label, prompt }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => sendMessage({ text: prompt })}
                    className="rounded-2xl border border-border bg-card p-4 text-left hover:shadow-md hover:border-primary/50 transition-all group"
                  >
                    <div className="mb-2 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="size-4 text-primary" aria-hidden="true" />
                    </div>
                    <div className="text-sm font-medium">{label}</div>
                    <div className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{prompt}</div>
                  </button>
                ))}
              </div>

              {/* Features List */}
              <div className="bg-accent/5 rounded-2xl p-4 border border-accent/20">
                <div className="flex items-start gap-2 text-xs text-muted-foreground mb-2">
                  <Zap className="size-4 mt-0.5 flex-shrink-0 text-accent" aria-hidden="true" />
                  <span className="font-medium">What I can help with:</span>
                </div>
                <ul className="text-xs space-y-1.5 text-muted-foreground">
                  <li>• Disease identification and treatment plans</li>
                  <li>• Irrigation scheduling and soil health</li>
                  <li>• Government schemes (PM-KISAN, PMFBY)</li>
                  <li>• Mandi prices and market trends</li>
                  <li>• Organic farming practices</li>
                </ul>
              </div>
            </div>
          ) : (
            messageArray.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-card border border-border rounded-bl-none"
                  }`}
                >
                  {Array.isArray(m.parts)
                    ? m.parts.map((part, i) => {
                        if (part.type === "text") {
                          return (
                            <span key={i} className="whitespace-pre-wrap">
                              {part.text}
                            </span>
                          )
                        }
                        return null
                      })
                    : null}
                </div>
              </div>
            ))
          )}

          {/* Typing Indicator */}
          {(status === "submitted" || status === "streaming") && (messageArray.length === 0 || messageArray[messageArray.length - 1]?.role !== "assistant") ? (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl rounded-bl-none px-4 py-3 text-sm inline-flex items-center gap-2">
                <Loader2 className="size-3.5 animate-spin text-muted-foreground" aria-hidden="true" />
                <span className="text-muted-foreground">Krishi Mitra is thinking...</span>
              </div>
            </div>
          ) : null}

          {/* Error Message */}
          {error ? (
            <div className="flex justify-start">
              <div className="bg-destructive/10 text-destructive rounded-2xl rounded-bl-none px-4 py-3 text-sm flex items-start gap-2 max-w-[85%]">
                <MessageCircle className="size-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <div className="font-medium">Unable to reach Krishi Mitra</div>
                  <p className="text-xs opacity-90 mt-0.5">The AI service is temporarily unavailable. Please try again in a moment.</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Input Form */}
        <form
          onSubmit={send}
          className="border-t border-border bg-card/80 backdrop-blur-sm p-3 safe-area-bottom sticky bottom-0"
        >
          <div className="flex items-center gap-2 rounded-full border border-border bg-background pl-4 pr-1 py-1 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Krishi Mitra..."
              aria-label="Message Krishi Mitra"
              className="flex-1 bg-transparent py-2.5 outline-none text-foreground placeholder:text-muted-foreground text-sm"
            />
            <button
              type="submit"
              disabled={!input.trim() || status === "submitted" || status === "streaming"}
              className="size-9 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              <Send className="size-4" aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
