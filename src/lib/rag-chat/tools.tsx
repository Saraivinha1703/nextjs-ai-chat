import { ExperimentalTool } from "ai";
import { createStreamableUI } from "ai/rsc";
import { z } from "zod";
import { getFilteredStockPrice, getFinancialInfo, getFirstShareInfo, getSiteEmbed, getStockPrice, getTickerInfo } from "./tools-functions";

export function generateTools(
  messageStream: ReturnType<typeof createStreamableUI>
) {
  const tools: Record<string, ExperimentalTool<any, any>> = {
    getFinancialInfo: {
      description:
        "For any question related to the financial context. If it is not related to finance do not call this tool.",
      parameters: z.object({
        userQuestion: z.string().describe("The whole user's question."),
      }),
      execute: async ({ userQuestion }) =>
        await getFinancialInfo(userQuestion, messageStream),
    },
    getTickerInfo: {
      description:
        "Get the ticker/stock symbol for the company according to a the name of the company.",
      parameters: z.object({
        companyName: z
          .string()
          .describe(
            "The company name to get the ticker/stock symbol. It must be a string value."
          ),
      }),
      execute: async ({ companyName }) =>
        await getTickerInfo(companyName, messageStream),
    },
    getStockPrice: {
      description:
        "Get the stock price for a company if the user passes the company ticker.",
      parameters: z.object({
        ticker: z
          .string()
          .describe(
            "The ticker symbol to get the stock price. It must be a string value."
          ),
      }),
      execute: async ({ ticker }) => await getStockPrice(ticker, messageStream),
    },
    getFilteredStockPrice: {
      description:
        "Get the stock price for a certain company if the user passes the ticker, exchange where the stock is traded and the country where the stock is traded",
      parameters: z.object({
        ticker: z
          .string()
          .describe("The ticker symbol to get the stock price."),
        exchange: z
          .string()
          .describe("Exchange where instrument/share/stock is traded."),
        country: z
          .string()
          .describe("Country where instrument/share/stock is traded."),
      }),
      execute: async ({ ticker, exchange, country }) =>
        await getFilteredStockPrice(ticker, exchange, country, messageStream),
    },
    getFirstShareInfo: {
      description:
        "When the user asks for his first share suggestion on how to choose it, use this tool.",
      parameters: z.object({
        userQuestion: z.string().describe("The whole user's question."),
      }),
      execute: async ({ userQuestion }) =>
        await getFirstShareInfo(messageStream),
    },
    getSiteEmbed: {
      description:
        "If the users asks to see a website and passes the link for it, use this tool. The link to the desired website must be a string with `https://` in the beggining.",
      parameters: z.object({
        webSiteLink: z.string().describe("The link to the desired website"),
      }),
      execute: async ({ webSiteLink }) =>
        await getSiteEmbed(webSiteLink, messageStream),
    },
  };

  return tools;
}
