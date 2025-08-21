export interface User {
  id: string
  name: string
  avatar: string
  location: string
  phone: string
  itemsCount: number
}

export interface Item {
  id: string
  title: string
  description: string
  category: string
  estimatedValue: number
  image: string
  ownerId: string
  ownerName: string
  ownerLocation: string
  status: "active" | "matched" | "traded"
}

export interface Match {
  id: string
  userId: string
  userName: string
  userAvatar: string
  itemId: string
  itemTitle: string
  itemImage: string
  lastMessage?: string
  lastMessageTime?: string
  isRead: boolean
}

export interface Message {
  id: string
  senderId: string
  content: string
  timestamp: string
  isRead: boolean
}

// Mock data
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "/woman-profile.png",
    location: "San Francisco, CA",
    phone: "(555) 123-4567",
    itemsCount: 12,
  },
  {
    id: "2",
    name: "Mike Rodriguez",
    avatar: "/man-profile.png",
    location: "Austin, TX",
    phone: "(555) 987-6543",
    itemsCount: 8,
  },
]

export const mockItems: Item[] = [
  {
    id: "1",
    title: "Vintage Leather Jacket",
    description: "Genuine leather jacket from the 80s. Great condition, just doesn't fit anymore.",
    category: "Clothing",
    estimatedValue: 150,
    image: "/vintagejack.png",
    ownerId: "1",
    ownerName: "Sarah Chen",
    ownerLocation: "San Francisco, CA",
    status: "active",
  },
  {
    id: "2",
    title: "Professional Camera Lens",
    description: "50mm f/1.8 lens for Canon cameras. Perfect for portraits and low light.",
    category: "Electronics",
    estimatedValue: 200,
    image: "/cameralens.jpeg",
    ownerId: "2",
    ownerName: "Mike Rodriguez",
    ownerLocation: "Austin, TX",
    status: "active",
  },
  {
    id: "3",
    title: "Handmade Ceramic Vase",
    description: "Beautiful handcrafted vase, perfect for home decoration. Made by local artist.",
    category: "Home & Garden",
    estimatedValue: 75,
    image: "/ceramicvase.jpg",
    ownerId: "1",
    ownerName: "Sarah Chen",
    ownerLocation: "San Francisco, CA",
    status: "active",
  },
]

export const mockMatches: Match[] = [
  {
    id: "1",
    userId: "1",
    userName: "Sarah Chen",
    userAvatar: "/woman-profile.png",
    itemId: "1",
    itemTitle: "Vintage Leather Jacket",
    itemImage: "/vintagejack.png",
    lastMessage: "Hi! I'm interested in trading my camera lens for your jacket.",
    lastMessageTime: "2h ago",
    isRead: false,
  },
  {
    id: "2",
    userId: "2",
    userName: "Mike Rodriguez",
    userAvatar: "/man-profile.png",
    itemId: "2",
    itemTitle: "Professional Camera Lens",
    itemImage: "/cameralens.jpeg",
    lastMessage: "Sounds good! When would you like to meet?",
    lastMessageTime: "1d ago",
    isRead: true,
  },
]

export const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "1",
    content: "Hi! I'm interested in trading my camera lens for your jacket.",
    timestamp: "2024-01-15T14:30:00Z",
    isRead: true,
  },
  {
    id: "2",
    senderId: "2",
    content: "That sounds great! Can you tell me more about the lens?",
    timestamp: "2024-01-15T14:35:00Z",
    isRead: true,
  },
  {
    id: "3",
    senderId: "1",
    content: "It's a 50mm f/1.8 Canon lens, barely used. Perfect condition!",
    timestamp: "2024-01-15T14:40:00Z",
    isRead: true,
  },
]
