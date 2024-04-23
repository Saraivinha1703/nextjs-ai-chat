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