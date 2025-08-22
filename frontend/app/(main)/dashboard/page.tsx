"use client"

import { useState, useEffect } from "react"
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

interface Item {
  id: string
  title: string
  description: string
  image?: string
  status: string
  location: string
}

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
  const [userItems, setUserItems] = useState<Item[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)

  const stats = {
    listedItems: userItems.length,
    activeMatches: 3,
    swipesThisWeek: 47,
  }
  

  // ---------- Fetch listings ----------
  useEffect(() => {
    fetch("http://localhost:8000/api/listings/")
      .then(res => res.json())
      .then(data => setUserItems(data))
      .catch(err => console.error(err))
  }, [])

  // ---------- Add new item ----------
  const handleAddItem = async (newItem: Omit<Item, "id" | "status">) => {
    try {
      const res = await fetch("http://localhost:8000/api/listings/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newItem.title,
          description: newItem.description,
          category: newItem.category,
          estimatedValue: newItem.estimatedValue,
          location: newItem.location || "Unknown",
          image: newItem.image || "",
        }),
      })
      if (res.ok) {
        const created = await res.json()
        setUserItems((prev) => [created, ...prev])
        setShowAddForm(false)
      } else {
        alert("Failed to create item")
      }
    } catch (err) {
      console.error(err)
      alert("Error creating item")
    }
  }

  // ---------- Edit item ----------
  const handleEditItem = async (updatedItem: Item) => {
    try {
      const res = await fetch(`http://localhost:8000/api/listings/${updatedItem.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      })
      if (res.ok) {
        const saved = await res.json()
        setUserItems((prev) => prev.map((i) => (i.id === saved.id ? saved : i)))
        setEditingItem(null)
      } else {
        alert("Failed to update item")
      }
    } catch (err) {
      console.error(err)
      alert("Error updating item")
    }
  }

  // ---------- Delete item ----------
  const handleDeleteItem = async (itemId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/listings/${itemId}/`, { method: "DELETE" })
      if (res.ok) {
        setUserItems((prev) => prev.filter((i) => i.id !== itemId))
      } else {
        alert("Failed to delete item")
      }
    } catch (err) {
      console.error(err)
      alert("Error deleting item")
    }
  }
}
  // ---------- Item Form ----------
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
      location: item?.location || "",
    })
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
      await onSubmit({ ...item, ...formData })
      setIsSubmitting(false)
    }

    const isValid =
      formData.title && formData.description && formData.category && formData.estimatedValue > 0

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
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Your location"
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

  // ---------- Item Card ----------
  const ItemCard = ({ item }: { item: Item }) => {
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
                    <DropdownMenuItem onClick={() => setEditingItem(item)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteItem(item.id)} className="text-destructive">
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

  // ---------- Render Form or Dashboard ----------
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
        {/* Stats */}
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

        {/* Items List */}
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
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

