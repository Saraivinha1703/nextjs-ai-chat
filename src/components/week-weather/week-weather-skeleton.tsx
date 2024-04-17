import { Skeleton } from "../ui/skeleton";

export function WeekWeatherSkeleton() {
    return (
      <Skeleton className="w-full">
        <Skeleton className="h-4 w-24 m-2" />
        <Skeleton className="flex flex-col w-full">
          <Skeleton className="w-full py-2">
            <div className="flex flex-col gap-2 px-12">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-full" />
            </div>
          </Skeleton>

          <Skeleton className="w-full py-2">
            <div className="flex flex-col gap-2 px-12">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-full" />
            </div>
          </Skeleton>

          <Skeleton className="w-full py-2">
            <div className="flex flex-col gap-2 px-12">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-full" />
            </div>
          </Skeleton>

          <Skeleton className="w-full py-2">
            <div className="flex flex-col gap-2 px-12">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-full" />
            </div>
          </Skeleton>
        </Skeleton>
      </Skeleton>
    );
}