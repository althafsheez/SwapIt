import type React from "react"
import Image from "next/image" 

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-start space-x-4 ">
  <Image
    src="/SwapIt_Logo.png"
    alt="SwapIt Logo"
    width={120}
    height={120}
    className="object-contain mt-2"
  />
  <h1 className="text-5xl font-bold text-primary leading-none">
    SwapIt
  </h1>
</div>



          <p className="text-sm text-muted-foreground mt-2">
            Swap items. Save money. Save the planet.
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
