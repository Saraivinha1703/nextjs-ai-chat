import { StockSymbolSearchSkeleton } from "@/components/stock-symbol-search/skeleton";
import { cn } from "../utils";
import { StockSymbolSearch } from "@/components/stock-symbol-search";
import { SymbolSearchObject } from "./types";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export function LookingUpForTicker() {
    return (
      <div className="w-full mr-2">
        <h1>Looking up 😁: </h1>
        <div
          className={cn(
            "[&::-webkit-scrollbar]:w-[0.35rem] [&::-webkit-scrollbar-track]:bg-accent [&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-thumb:hover]:bg-primary/50",
            "flex flex-col gap-2 p-2 max-h-96 overflow-auto bg-gradient-to-t from-background to-transparent"
          )}
        >
          <StockSymbolSearchSkeleton />
          <StockSymbolSearchSkeleton />
          <StockSymbolSearchSkeleton />
          <StockSymbolSearchSkeleton />
          <StockSymbolSearchSkeleton />
          <StockSymbolSearchSkeleton />
          <StockSymbolSearchSkeleton />
        </div>
      </div>
    );
} 

type DisplayingTickersProps = {
  data: SymbolSearchObject[];
};

export function DisplayingTickers({ data }: DisplayingTickersProps) {
  return (
    <div className="w-full mr-2">
      <h1>Here is what I&apos;ve found 🥳: </h1>
      <div
        className={cn(
          "[&::-webkit-scrollbar]:w-[0.35rem] [&::-webkit-scrollbar-track]:bg-accent [&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-thumb:hover]:bg-primary/50",
          "flex flex-col gap-2 p-2 max-h-96 overflow-auto bg-gradient-to-t from-background to-transparent"
        )}
      >
        {data.map((val, idx) => (
          <StockSymbolSearch
            key={idx}
            instrumentName={val.instrument_name}
            micCode={val.mic_code}
            exchangeTimezone={val.exchange_timezone}
            instrumentType={val.instrument_type}
            {...val}
          />
        ))}
      </div>
    </div>
  );
}

export function FilteredStockPriceCardSkeleton() {
  return (
    <div className="w-full py-1">
      <Skeleton className="mb-1 h-4 w-48 rounded-sm" />
      <Skeleton className="flex flex-col gap-6 w-5/6 px-8 py-4">
        <div className="flex flex-col gap-2">
          <div className="flex w-full justify-between">
            <Skeleton className="h-5 w-20 rounded-sm" />
            <Skeleton className="h-3 w-24 rounded-sm" />
          </div>
          <Skeleton className="h-3 w-16 rounded-sm" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="w-28 h-3 rounded-sm"/>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-1/4 h-10" />
              <Skeleton className="w-full h-3 rounded-sm" />
            </div>
          <Skeleton className="flex justify-between items-end p-4">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="w-16 h-5" />
              <Skeleton className="w-8 h-5" />
            </div>
            <Skeleton className="w-6 h-6 rounded-sm" />
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="w-10 h-6" />
              <Skeleton className="w-11 h-5" />
            </div>
            <Skeleton className="w-6 h-6 rounded-sm" />
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="w-10 h-6" />
              <Skeleton className="w-16 h-5" />
            </div>
          </Skeleton>
          </div>
        </div>
      </Skeleton>
    </div>
  );
}