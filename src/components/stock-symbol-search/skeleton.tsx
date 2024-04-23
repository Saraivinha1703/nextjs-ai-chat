import { Skeleton } from "../ui/skeleton";

export function StockSymbolSearchSkeleton()  {
    return (
      <Skeleton className="flex flex-col gap-3 w-full h-56 px-4 py-2">
        <div className="flex w-full justify-between py-1">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-14" />
        </div>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-20" />
      </Skeleton>
    );
}