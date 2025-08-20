import type React from "react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">SwapIt</h1>
          <p className="text-sm text-muted-foreground">Swap items. Save money. Save the planet.</p>
        </div>
        {children}
      </div>
    </div>
  )
}
