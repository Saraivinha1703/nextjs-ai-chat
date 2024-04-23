import { ExperimentalTool } from "ai";
import { createStreamableUI } from "ai/rsc";
import { z } from "zod";
import { getFinancialInfo, getStockPrice, getTickerInfo } from "./tools-functions";

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
      execute: async ({ ticker }) => 
        await getStockPrice(ticker, messageStream),
    },
  };

  return tools;
}
