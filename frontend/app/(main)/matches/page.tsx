"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { mockMatches } from "@/lib/placeholders"

export default function MatchesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">Matches</h1>
        </div>
      </div>

      {mockMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center space-y-4 p-8 mt-20">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">No matches yet</h3>
          <p className="text-muted-foreground max-w-sm">
            Keep swiping to find items you'd like to trade! When someone likes your item back, you'll see them here.
          </p>
        </div>
      ) : (
        <div className="p-4 space-y-2">
          {mockMatches.map((match) => (
            <div
              key={match.id}
              className="flex items-center gap-4 p-4 rounded-2xl bg-card hover:bg-card/80 transition-colors cursor-pointer"
              onClick={() => router.push(`/matches/${match.id}`)}
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={match.userAvatar || "/placeholder.svg"} alt={match.userName} />
                <AvatarFallback>
                  {match.userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm truncate">{match.userName}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {match.itemTitle}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{match.lastMessage || "Say hello!"}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <img
                  src={match.itemImage || "/placeholder.svg"}
                  alt={match.itemTitle}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{match.lastMessageTime}</span>
                  {!match.isRead && <div className="w-2 h-2 bg-primary rounded-full" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
