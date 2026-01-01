import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/container";

export default function Loading() {
  return (
    <Container className="py-24 space-y-12">
      {/* Hero Skeleton */}
      <div className="space-y-4 max-w-2xl mx-auto text-center">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-6 w-1/2 mx-auto" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    </Container>
  );
}
