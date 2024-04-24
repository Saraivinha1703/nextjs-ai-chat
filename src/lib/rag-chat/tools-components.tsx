import { StockSymbolSearchSkeleton } from "@/components/stock-symbol-search/skeleton";
import { cn } from "../utils";
import { StockSymbolSearch } from "@/components/stock-symbol-search";
import { SymbolSearchObject } from "./types";
import { Skeleton } from "@/components/ui/skeleton";

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

type FilteredStockPriceCardProps = {
  ticker: string;
  exchange: string;
  country: string;
  priceNum: number;
};

export function FilteredStockPriceCard({ticker, country, exchange, priceNum}: FilteredStockPriceCardProps) {
  return (
    <div className="w-full">
      <span>Here is the price that you asked 🥳:</span>
      <div className="w-5/6 px-8 py-4 bg-accent/50 rounded-lg ring-1 ring-primary">
        <div className="flex w-full justify-between">
          <h1 className="bg-gradient-to-tr from-secondary to-primary text-transparent bg-clip-text font-bold">
            {ticker}
          </h1>
          <span className="text-primary/60 text-sm">Exchange: {exchange}</span>
        </div>
        <span className="text-sm text-muted">{country}</span>
        <div>
          <span className="text-lg font-semibold">${priceNum.toFixed(2)}</span>
          <span className="text-muted text-sm">(dolars)</span>
        </div>
      </div>
    </div>
  );
}

export function FilteredStockPriceCardSkeleton() {
  return (
    <div className="w-full py-1">
      <Skeleton className="mb-1 h-4 w-48 rounded-sm" />
      <Skeleton className="flex flex-col gap-2 w-5/6 px-8 py-4">
        <div className="flex w-full justify-between">
          <Skeleton className="h-5 w-20 rounded-sm" />
          <Skeleton className="h-3 w-24 rounded-sm" />
        </div>
        <Skeleton className="h-3 w-16 rounded-sm" />
        <div>
          <Skeleton className="h-5 w-32" />
        </div>
      </Skeleton>
    </div>
  );
}