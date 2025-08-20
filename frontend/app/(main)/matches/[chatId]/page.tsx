"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Send } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { mockMatches, mockMessages } from "@/lib/placeholders"

export default function ChatPage() {
  const router = useRouter()
  const params = useParams()
  const chatId = params.chatId as string
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState(mockMessages)

  const match = mockMatches.find((m) => m.id === chatId)
  const currentUserId = "2"

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    const message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
    }
    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Match not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src={match.userAvatar || "/placeholder.svg"} alt={match.userName} />
            <AvatarFallback>
              {match.userName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Button
              variant="ghost"
              className="p-0 h-auto font-semibold text-left justify-start"
              onClick={() => router.push(`/profile/${match.userId}`)}
            >
              {match.userName}
            </Button>
            <p className="text-xs text-muted-foreground">Trading: {match.itemTitle}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => {
            const isCurrentUser = message.senderId === currentUserId
            return (
              <div key={message.id} className={`flex gap-3 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
                {!isCurrentUser && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={match?.userAvatar || "/placeholder.svg"} alt={match?.userName} />
                    <AvatarFallback>
                      {match?.userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={`flex flex-col gap-1 max-w-[70%] ${isCurrentUser ? "items-end" : ""}`}>
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isCurrentUser
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-card text-card-foreground rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <span className="text-xs text-muted-foreground px-2">{formatTime(message.timestamp)}</span>
                </div>
              </div>
            )
          })}
        </div>
        <div className="border-t bg-background p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-full"
            />
            <Button type="submit" size="icon" className="rounded-full" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
