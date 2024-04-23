import { StockSymbolSearchSkeleton } from "@/components/stock-symbol-search/skeleton";
import { cn } from "../utils";
import { StockSymbolSearch } from "@/components/stock-symbol-search";
import { SymbolSearchObject } from "./types";

export function LookingUpForTicker() {
    return (
      <div className="w-full mr-2">
        <h1>Looking up 😁: </h1>
        <div
          className={cn(
            "[&::-webkit-scrollbar]:w-[0.35rem] [&::-webkit-scrollbar-track]:bg-accent [&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-thumb:hover]:bg-primary/50",
            "flex flex-col gap-2 p-2 max-h-72 overflow-auto bg-gradient-to-t from-background to-transparent"
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
          "flex flex-col gap-2 p-2 max-h-72 overflow-auto bg-gradient-to-t from-background to-transparent"
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