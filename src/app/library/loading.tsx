import { Skeleton } from '@/components/ui/Skeleton'

export default function LibraryLoading() {
  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-80 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Book Grid Skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Cover Image Skeleton */}
              <Skeleton className="h-64 w-full rounded-none" />
              
              {/* Book Info Skeleton */}
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
