import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "default" | "lg" | "xl"
  className?: string
}

const sizeClasses = {
  sm: "h-4 w-4",
  default: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16"
}

export function LoadingSpinner({ size = "default", className }: LoadingSpinnerProps) {
  return (
    <div className="flex justify-center items-center">
      <Loader2 
        className={cn(
          "animate-spin text-primary",
          sizeClasses[size],
          className
        )} 
      />
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-muted-foreground animate-pulse">Loading...</p>
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-card animate-pulse">
      <div className="h-48 bg-muted shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 bg-muted rounded shimmer" />
        <div className="h-4 w-full bg-muted rounded shimmer" />
        <div className="h-4 w-2/3 bg-muted rounded shimmer" />
        <div className="flex justify-between pt-2">
          <div className="h-6 w-20 bg-muted rounded shimmer" />
          <div className="h-9 w-24 bg-muted rounded-lg shimmer" />
        </div>
      </div>
    </div>
  )
}
