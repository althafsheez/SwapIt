"use client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, MapPin, Phone, MessageCircle } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { mockUsers, mockItems } from "@/lib/placeholders"

export default function ProfilePage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.userId as string

  const user = mockUsers.find((u) => u.id === userId)
  const userItems = mockItems.filter((item) => item.ownerId === userId)

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">User not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">Profile</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* User Info */}
        <div className="text-center space-y-4">
          <Avatar className="h-24 w-24 mx-auto">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="text-2xl">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <div className="flex items-center justify-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {user.location}
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {user.phone}
              </div>
            </div>
          </div>
          <Button className="rounded-full">
            <MessageCircle className="w-4 h-4 mr-2" />
            Continue Chat
          </Button>
        </div>

        
        {/* Static Map */}
        <div className="flex justify-center">
          <div className="h-64 w-[85%] rounded-xl overflow-hidden shadow">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                user.location
              )}&output=embed`}
            />
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{user.itemsCount}</div>
            <div className="text-sm text-muted-foreground">Items Listed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">4.8</div>
            <div className="text-sm text-muted-foreground">Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">23</div>
            <div className="text-sm text-muted-foreground">Trades</div>
          </div>
        </div>

        {/* User Items */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Items Available</h3>
          <div className="grid grid-cols-2 gap-4">
            {userItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
                  <Badge className="absolute top-2 right-2 bg-background/80 text-foreground">
                    ${item.estimatedValue}
                  </Badge>
                </div>
                <CardContent className="p-3">
                  <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
                  <Badge variant="outline" className="text-xs mt-2">
                    {item.category}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
