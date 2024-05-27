"use client";

import { useActions, useUIState } from "ai/rsc";
import { Button } from "../ui/button";
import { AI } from "@/lib/rag-chat/actions";
import { Message } from "../message";

type StockSymbolSearchProps = {
  symbol: string;
  instrumentName: string;
  exchange: string;
  micCode: string;
  exchangeTimezone: string;
  instrumentType: string;
  country: string;
  currency: string;
};

export function StockSymbolSearch({symbol, currency, country, instrumentName, exchange}: StockSymbolSearchProps) {
  const { submitUserMessageRAGChat } = useActions<typeof AI>();
  const [_, setMessages] = useUIState<typeof AI>();

  const handleStockPrice = async () => {
    const input = `get me the filtered stock price for the ticker ${symbol} in the exchange ${exchange} at the country ${country}.`;
    setMessages((curr) => [
      ...curr,
      {
        id: Date.now().toString(),
        display: (
          <div className="flex w-full justify-end">
            <Message className="hidden" from="user">
              {input}
            </Message>
          </div>
        ),
      },
    ]);

    const response = await submitUserMessageRAGChat(input);

    setMessages((currentMessages) => [...currentMessages, response]);
  }

    return (
      <div className="flex flex-col gap-2 w-full group bg-accent/50 rounded-md px-4 py-2 transition-all duration-300 hover:ring-1 hover:ring-primary">
        <div className="flex w-full justify-between py-1">
          <h1 className="text-lg font-semibold transition-all duration-200 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-tr group-hover:from-secondary group-hover:to-primary">
            {symbol}
          </h1>
          <span className="h-fit text-primary px-1 py-0.5 text-sm rounded-lg ring-1 ring-primary">
            {currency}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-primary max-w-64">
            {instrumentName}
          </span>
          <span className="text-xs text-primary/60">Exchange: {exchange}</span>
        </div>
        <span className="text-xs text-muted">{country}</span>

        <Button
          variant="outline"
          size="sm"
          className="w-fit transition-all duration-500 bg-accent hover:bg-gradient-to-tr from-secondary to-primary"
          onClick={handleStockPrice}
        >
          See price
        </Button>
      </div>
    );
}