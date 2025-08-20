"use client"
import { Button } from "@/components/ui/button"
import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { LayoutGrid, MessageCircle, Menu, Leaf, MapPin, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { mockItems } from "@/lib/placeholders"
import type { Item } from "@/lib/placeholders"

function SwipeCard({
  item,
  index,
  onSwipe,
  isTop,
}: {
  item: Item
  index: number
  onSwipe: (itemId: string, direction: "left" | "right") => void
  isTop: boolean
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })

  const handleStart = (clientX: number, clientY: number) => {
    if (!isTop) return
    setIsDragging(true)
    setStartPos({ x: clientX, y: clientY })
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !isTop) return
    const deltaX = clientX - startPos.x
    const deltaY = clientY - startPos.y
    setDragOffset({ x: deltaX, y: deltaY })
  }

  const handleEnd = () => {
    if (!isDragging || !isTop) return
    const threshold = 100
    const { x } = dragOffset
    if (Math.abs(x) > threshold) {
      const direction = x > 0 ? "right" : "left"
      onSwipe(item.id, direction)
    }
    setIsDragging(false)
    setDragOffset({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => handleStart(e.clientX, e.clientY)
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY)
  }

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX, e.clientY)
    }
    const handleGlobalMouseUp = () => {
      if (isDragging) handleEnd()
    }
    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove)
      document.addEventListener("mouseup", handleGlobalMouseUp)
    }
    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [isDragging, startPos])

  const rotation = dragOffset.x * 0.1
  const opacity = Math.max(0.7, 1 - Math.abs(dragOffset.x) / 200)
  const cardStyle = {
    transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg) scale(${isTop ? 1 : 0.95 - index * 0.05})`,
    opacity: isTop ? opacity : 1,
    zIndex: 10 - index,
    transition: isDragging ? "none" : "all 0.3s ease-out",
  }

  return (
    <div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={cardStyle}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleEnd}
    >
      <Card className="w-full h-full shadow-xl border-0 overflow-hidden bg-card">
        <div className="relative h-2/3">
          <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-background/80 text-foreground">
              <DollarSign className="w-3 h-3 mr-1" />${item.estimatedValue}
            </Badge>
          </div>
        </div>
        <CardContent className="p-6 h-1/3 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-xl font-bold line-clamp-1">{item.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">
                  {item.ownerName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">{item.ownerName}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {item.ownerLocation}
                </div>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {item.category}
            </Badge>
          </div>
        </CardContent>
      </Card>
      {isDragging && (
        <>
          <div
            className={`absolute top-1/2 left-8 transform -translate-y-1/2 px-4 py-2 rounded-full font-bold text-lg transition-opacity ${
              dragOffset.x > 50 ? "opacity-100 bg-primary text-primary-foreground" : "opacity-0"
            }`}
          >
            LIKE
          </div>
          <div
            className={`absolute top-1/2 right-8 transform -translate-y-1/2 px-4 py-2 rounded-full font-bold text-lg transition-opacity ${
              dragOffset.x < -50 ? "opacity-100 bg-destructive text-destructive-foreground" : "opacity-0"
            }`}
          >
            PASS
          </div>
        </>
      )}
    </div>
  )
}

export default function SwipePage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipedItems, setSwipedItems] = useState<Set<string>>(new Set())

  const handleSwipe = (itemId: string, direction: "left" | "right") => {
    setSwipedItems((prev) => new Set([...prev, itemId]))
    setTimeout(() => setCurrentIndex((prev) => prev + 1), 300)
  }

  const visibleItems = mockItems.slice(currentIndex, currentIndex + 3)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4">
          <h1 className="text-lg font-bold text-primary">SwapIt</h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground border-secondary/30">
              <Leaf className="w-3 h-3 mr-1" />
              Saved 12 items from landfill
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        {currentIndex >= mockItems.length ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4 p-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">🎉</span>
            </div>
            <h3 className="text-xl font-semibold">No more items!</h3>
            <p className="text-muted-foreground">Check back later for new items to swap.</p>
          </div>
        ) : (
          <div className="relative w-full max-w-sm mx-auto h-[600px]">
            {visibleItems.map((item, index) => (
              <SwipeCard key={item.id} item={item} index={index} onSwipe={handleSwipe} isTop={index === 0} />
            ))}
          </div>
        )}
      </div>

      <Button
        onClick={() => router.push("/dashboard")}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        size="icon"
      >
        <LayoutGrid className="w-6 h-6" />
      </Button>

      <Button
        onClick={() => router.push("/matches")}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </div>
  )
}
