"use client";

import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

type FilteredStockPriceCardProps = {
  ticker: string;
  exchange: string;
  country: string;
  priceNum: number;
};

export function FilteredStockPriceCard({
  ticker,
  country,
  exchange,
  priceNum,
}: FilteredStockPriceCardProps) {
  const [shareNum, setShareNum] = useState<number>(1);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const num = parseInt(e.target.value)

    if(Number.isNaN(num) || num > 500) return;

    setShareNum(num);
  }

  return (
    <div className="w-full">
      <span>Here is the price that you asked 🥳:</span>
      <div className="w-5/6 px-8 py-4 bg-accent/40 rounded-lg ring-1 ring-primary">
        <div className="flex w-full justify-between">
          <h1 className="bg-gradient-to-tr from-secondary to-primary text-transparent bg-clip-text font-bold">
            {ticker}
          </h1>
          <span className="text-primary/60 text-sm">Exchange: {exchange}</span>
        </div>
        <span className="text-sm text-muted">{country}</span>
        <div className="flex flex-col gap-6">
          <div>
            <span className="text-lg font-semibold">
              ${priceNum.toFixed(2)}
            </span>
            <span className="text-muted text-sm">(dolars)</span>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-light">Number of shares</span>
              <div className="flex gap-2">
                <Input
                  className="w-1/4"
                  type="number"
                  value={shareNum}
                  onChange={handleChange}
                />
                <Slider
                  defaultValue={[1]}
                  max={500}
                  min={1}
                  value={[shareNum]}
                  onValueChange={(val) => setShareNum(val[0])}
                  step={1}
                />
              </div>
            </div>
            <div className="flex justify-between items-end bg-background/80 p-4 rounded-lg ring-1 ring-secondary">
              <div className="flex flex-col items-center">
                <span className="font-medium">Shares</span>
                <span className="font-bold text-secondary">{shareNum}</span>
              </div>
              <span className="text-lg font-semibold">X</span>
              <div className="flex flex-col items-center">
                <span className="font-medium">Price</span>
                <span className="font-bold text-primary">
                  ${priceNum.toFixed(2)}
                </span>
              </div>
              <span className="text-lg font-semibold">=</span>
              <div className="flex flex-col items-center">
                <span className="font-medium">Total</span>
                <span className="bg-gradient-to-tr from-secondary to-primary text-transparent bg-clip-text font-bold">
                  ${(shareNum * priceNum).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}