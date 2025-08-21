"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowLeft, Plus, MoreVertical, Edit, Trash2, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { mockItems } from "@/lib/placeholders"
import type { Item } from "@/lib/placeholders"

const categories = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Books",
  "Sports & Outdoors",
  "Toys & Games",
  "Art & Crafts",
  "Music & Instruments",
  "Other",
]

export default function DashboardPage() {
  const router = useRouter()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [userItems, setUserItems] = useState<Item[]>(mockItems.filter((item) => item.ownerId === "2"))

  const currentUserId = "2"

  const handleAddItem = (newItem: Omit<Item, "id" | "ownerId" | "ownerName" | "ownerLocation">) => {
    const item: Item = {
      ...newItem,
      id: Date.now().toString(),
      ownerId: currentUserId,
      ownerName: "You",
      ownerLocation: "Your Location",
    }
    setUserItems((prev) => [item, ...prev])
    setShowAddForm(false)
  }

  const handleEditItem = (updatedItem: Item) => {
    setUserItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
    setEditingItem(null)
  }

  const handleDeleteItem = (itemId: string) => {
    setUserItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const stats = {
    listedItems: userItems.length,
    activeMatches: 3,
    swipesThisWeek: 47,
  }

  const ItemForm = ({
    item,
    onSubmit,
    onCancel,
  }: {
    item?: Item | null
    onSubmit: (item: any) => void
    onCancel: () => void
  }) => {
    const [formData, setFormData] = useState({
      title: item?.title || "",
      description: item?.description || "",
      category: item?.category || "",
      estimatedValue: item?.estimatedValue || 0,
      image: item?.image || "",
      status: item?.status || "active",
    })
    const [imagePreview, setImagePreview] = useState<string>(item?.image || "")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({
        ...prev,
        [name]: name === "estimatedValue" ? Number(value) : value,
      }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSubmitting(true)
      setTimeout(() => {
        if (item) {
          onSubmit({ ...item, ...formData })
        } else {
          onSubmit(formData)
        }
        setIsSubmitting(false)
      }, 1000)
    }

    const isValid = formData.title && formData.description && formData.category && formData.estimatedValue > 0

    return (
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>{item ? "Edit Item" : "Add New Item"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Item Name *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="What are you trading?"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your item..."
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedValue">Estimated Value ($) *</Label>
                <Input
                  id="estimatedValue"
                  name="estimatedValue"
                  type="number"
                  min="1"
                  value={formData.estimatedValue}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button type="submit" disabled={!isValid || isSubmitting} className="flex-1">
                  {isSubmitting ? "Saving..." : item ? "Update Item" : "Add Item"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  const ItemCard = ({
    item,
    onEdit,
    onDelete,
  }: {
    item: Item
    onEdit: () => void
    onDelete: () => void
  }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case "active":
          return "bg-green-100 text-green-800 border-green-200"
        case "matched":
          return "bg-blue-100 text-blue-800 border-blue-200"
        case "traded":
          return "bg-gray-100 text-gray-800 border-gray-200"
        default:
          return "bg-gray-100 text-gray-800 border-gray-200"
      }
    }

    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex gap-4">
            <div className="w-24 h-24 flex-shrink-0 bg-gray-50 flex items-center justify-center pl-2">
              <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 p-4 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(item.status)}`}>{item.status}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <DollarSign className="w-3 h-3" />
                      {item.estimatedValue}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onDelete} className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (showAddForm || editingItem) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-4 p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowAddForm(false)
                setEditingItem(null)
              }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">{editingItem ? "Edit Item" : "Add New Item"}</h1>
          </div>
        </div>
        <ItemForm
          item={editingItem}
          onSubmit={editingItem ? handleEditItem : handleAddItem}
          onCancel={() => {
            setShowAddForm(false)
            setEditingItem(null)
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="rounded-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-2xl bg-card">
            <div className="text-2xl font-bold text-primary">{stats.listedItems}</div>
            <div className="text-sm text-muted-foreground">Listed Items</div>
          </div>
          <div className="text-center p-4 rounded-2xl bg-card">
            <div className="text-2xl font-bold text-primary">{stats.activeMatches}</div>
            <div className="text-sm text-muted-foreground">Active Matches</div>
          </div>
          <div className="text-center p-4 rounded-2xl bg-card">
            <div className="text-2xl font-bold text-primary">{stats.swipesThisWeek}</div>
            <div className="text-sm text-muted-foreground">Swipes This Week</div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Items</h2>
          {userItems.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No items yet</h3>
                <p className="text-muted-foreground">Add your first item to start trading!</p>
              </div>
              <Button onClick={() => setShowAddForm(true)} className="rounded-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Item
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {userItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onEdit={() => setEditingItem(item)}
                  onDelete={() => handleDeleteItem(item.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
