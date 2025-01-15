// app/auth/loading.tsx
import { GalleryVerticalEnd } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function AuthLoading() {
  return (
    <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xs space-y-6">
        {/* Title Skeleton */}
        <div className="flex flex-col items-center gap-2 text-center">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
        </div>

        {/* Form Fields Skeleton */}
        <div className="space-y-4">
            <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
            </div>
        </div>

        {/* Buttons Skeleton */}
        <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="relative text-center">
            <Skeleton className="mx-auto h-4 w-32" />
            </div>
            <Skeleton className="h-10 w-full" />
        </div>

        {/* Footer Link Skeleton */}
        <div className="text-center">
            <Skeleton className="mx-auto h-4 w-48" />
        </div>
        </div>
    </div>
  )
}