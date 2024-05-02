import { MessageSkeleton } from "@/components/message/skeleton";
import { createStreamableUI } from "ai/rsc";
import { getLLMPineconeVectorStoreQueryResponse } from "./main";
import { Message } from "@/components/message";
import { DisplayingTickers, FilteredStockPriceCardSkeleton, LookingUpForTicker } from "./tools-components";
import { SymbolSearchObject } from "./types";
import { FilteredStockPriceCard } from "./tools-client-components";
import { sleep } from "../utils";
import puppeteer from "puppeteer"

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
    messageStream.update(<FilteredStockPriceCardSkeleton />);
    await sleep(4000);
    const url = `https://api.twelvedata.com/price?symbol=${ticker}&exchange=${exchange}&country=${country}&apikey=${process.env.TWELVEDATA_API_KEY}`;

    const response = await fetch(url);
    const { price } = (await response.json()) as { price: string };
    const priceNum = parseFloat(price);

    if(Number.isNaN(priceNum)) {
      messageStream.update(<Message from="ai">Sorry, couldn&apos;t find the price for this stock 😔.</Message>);
      return
    }

    messageStream.update(<FilteredStockPriceCard country={country} ticker={ticker} exchange={exchange} priceNum={priceNum} />);
}

export async function getFirstShareInfo(
  messageStream: ReturnType<typeof createStreamableUI>
) {
  //https://www.degiro.pt/centro-de-conhecimento/academia-do-investidor/curso-iniciantes/preco-acaoo

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(
    "https://www.degiro.pt/centro-de-conhecimento/academia-do-investidor/curso-iniciantes/preco-acaoo"
  );

  await page.click(
    "button#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll"
  );

  const pText = await page.$$eval("#top-lesson p", arr => arr.map(p => p.textContent));
  
  console.log(pText);
  messageStream.update(<Message from="ai">{pText}</Message>)

  await page.close();
}

export async function getSiteEmbed(
  link: string,
  messageStream: ReturnType<typeof createStreamableUI>
) {
  messageStream.update(
    <div>
      <h1>Here is the site that you asked for 🥳!</h1>
      <iframe src={link} width={500} height={500} className="ring-1 ring-secondary rounded-md"></iframe>
    </div>
  )
}