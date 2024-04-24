import { MessageSkeleton } from "@/components/message/skeleton";
import { createStreamableUI } from "ai/rsc";
import { getLLMPineconeVectorStoreQueryResponse } from "./main";
import { Message } from "@/components/message";
import { DisplayingTickers, LookingUpForTicker } from "./tools-components";
import { SymbolSearchObject } from "./types";
import { sleep } from "../utils";

export async function getFinancialInfo(userQuestion: string, messageStream: ReturnType<typeof createStreamableUI>) {
    messageStream.update(<MessageSkeleton />);
    const response = await getLLMPineconeVectorStoreQueryResponse(userQuestion);
    messageStream.update(<Message from="ai">{response}</Message>);
}

export async function getTickerInfo(
  companyName: string,
  messageStream: ReturnType<typeof createStreamableUI>
) {
  messageStream.update(<LookingUpForTicker />);

  const url = `https://api.twelvedata.com/symbol_search?symbol=${companyName}`;
  const response = await fetch(url, { method: "GET" });
  const { data } = (await response.json()) as {
    data: SymbolSearchObject[];
  };
  await sleep(3000);
  console.log(data);

  if (data === undefined) {
    messageStream.update(
      <Message from="ai">Sorry, I could not find anything 😔</Message>
    );
    return;
  } else if (data.length === 0) {
    messageStream.update(
      <Message from="ai">
        Sorry, there are no registers for this company, maybe it is a private
        company or you may have misspelled it. 😔
      </Message>
    );
    return;
  }

  messageStream.update(<DisplayingTickers data={data} />);
}

export async function getStockPrice(
  ticker: string,
  messageStream: ReturnType<typeof createStreamableUI>
) {
  console.log("getting stock price");

  const url = `https://api.twelvedata.com/price?symbol=${ticker}&apikey=${process.env.TWELVEDATA_API_KEY}`;

  const response = await fetch(url);
  const { price } = (await response.json()) as { price: string };
    const priceNum = parseFloat(price)

  messageStream.update(
    <Message from="ai">
      The price for{" "}
      <span className="bg-gradient-to-tr from-secondary to-primary text-transparent bg-clip-text font-bold">
        {ticker}
      </span>{" "}
      is $<span className="font-semibold">{priceNum.toFixed(2)}</span> <span className="text-sm text-muted font-light">(dolars)</span> 😊.
    </Message>
  );
}

export async function getFilteredStockPrice(
  ticker: string,
  exchange: string,
  country: string,
  messageStream: ReturnType<typeof createStreamableUI>
) {
    console.log("getting stock price");

    const url = `https://api.twelvedata.com/price?symbol=${ticker}&exchange=${exchange}&country=${country}&apikey=${process.env.TWELVEDATA_API_KEY}`;

    const response = await fetch(url);
    const { price } = (await response.json()) as { price: string };
    const priceNum = parseFloat(price);

    if(Number.isNaN(priceNum)) {
      messageStream.update(<Message from="ai">Sorry, couldn&apos;t find the price for this stock 😔.</Message>);
      return
    }

    messageStream.update(
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