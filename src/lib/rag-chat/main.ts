import { PromptTemplate } from "@langchain/core/prompts";
import { ExperimentalMessage, experimental_generateText } from "ai";
import { createStreamableUI } from "ai/rsc";
import { generateTools } from "./tools";
import { Mistral } from "ai/mistral";
import { queryPineconeVectorStoreAndLLM } from "../pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { pineconeRAGChatIndex } from "../../../config";

const client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

const togetherai = new Mistral({
  apiKey: process.env.TOGETHER_AI_API_KEY,
  baseUrl: "https://api.together.xyz/v1",
});

export const getResult = async (
  history: ExperimentalMessage[],
  messageStream: ReturnType<typeof createStreamableUI>
) =>
  await experimental_generateText({
    model: togetherai.chat("mistralai/Mixtral-8x7B-Instruct-v0.1"),
    temperature: 0.1,
    tools: generateTools(messageStream),
    system: `You are a polity and helpful assistant that can access external information through your tools.
      You can give infomation about finance when the user asks for it passing the question in string, it can not be a numerical value or not related to finance, using \`getFinancialInfo\`
      You can get the ticker infomation when the user asks for it passing the name of the company in string, it can not be a numerical value, using \`getTickerInfo\`
      You can get the stock price when the user asks for it passing the ticker from a company in string, it can not be a numerical value, using \`getStockPrice\`
      Your name is Mistral AI.`,
    messages: [...history],
  });

export const getLLMPineconeVectorStoreQueryResponse = async (question: string): Promise<string> => 
    await queryPineconeVectorStoreAndLLM(client, pineconeRAGChatIndex, question);
