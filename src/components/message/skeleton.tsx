import { Skeleton } from "../ui/skeleton";

export function MessageSkeleton() {
    return (
        <Skeleton className="w-64 h-24 p-2 rounded-tl-none">
            <Skeleton className="h-4 w-8"/>
            <div className="flex flex-col gap-1 pt-2">
                <Skeleton className="h-4 w-56"/>
                <Skeleton className="h-4 w-52"/>
                <Skeleton className="h-4 w-32"/>
            </div>
        </Skeleton>
    )
}