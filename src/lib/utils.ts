import { OpenAIEmbeddings, OpenAI } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { loadQAStuffChain } from "langchain/chains";
import { timeout } from "../../config";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Pinecone } from "@pinecone-database/pinecone";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * This function create a new index in `Pinecone`.
 * @param client
 * @param indexName
 * @param vectorDimension
 */
export const createPineconeIndex = async (
  client: Pinecone,
  indexName: string,
  vectorDimension: any
) => {
  // Initiate index existence check
  console.log(`Checking "${indexName}"...`);

  // Get list of existing indexes
  const existingIndexes = await client.listIndexes();

  if (
    !existingIndexes.indexes?.find((model) => model.name === indexName)
  ) {
    console.log(`Creating "${indexName}"...`);
    await client.createIndex({
      name: indexName,
      dimension: vectorDimension,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "eu-west-1",
        },
      },
    });

    console.log("Creating index...");
    // ??
    await new Promise(resolve => setTimeout(resolve, timeout));
  } else {
    console.log("Index already exists.");
  }
};

/**
 * Upload data to `Pinecone`.
 * @param client
 * @param indexName
 * @param docs
 */
export const updatePineconeIndex = async (
  client: Pinecone,
  indexName: string,
  docs: Document<Record<string, any>>[]
) => {
  const index = client.Index(indexName);

  for (const doc of docs) {
    const txtPath = doc.metadata.source;
    const text = doc.pageContent;

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });

    const chunks = await textSplitter.createDocuments([text]);
    const embeddingsArrays = await new OpenAIEmbeddings().embedDocuments(
      chunks.map((chunck) => chunck.pageContent.replace(/\n/g, " "))
    );

    const batchSize = 100;
    let batch: any[] = [];

    //create and upsert vectors in batches of 100
    chunks.map(async (chunk, idx) => {
      const vector = {
        id: `${txtPath}_${idx}`,
        values: embeddingsArrays[idx],
        metadata: {
          ...chunk.metadata,
          loc: JSON.stringify(chunk.metadata.loc),
          pageContent: chunk.pageContent,
          txtPath,
        },
      };

      batch = [...batch, vector];

      if (batch.length === batchSize || idx === chunks.length - 1) {
        await index.upsert(batch);
        batch = [];
      }
    });
  }
};

/**
 * Query data on `Pinecone` vector store database and the `LLM`.
 * @param client
 * @param indexName
 * @param query
 */
export const queryPineconeVectorStoreAndLLM = async (
  client: Pinecone,
  indexName: string,
  query: string
) => {
  console.log("Querying Pinecone vector store...");
  const index = client.Index(indexName);

  // Create query embedding
  const queryEmbedding = await new OpenAIEmbeddings().embedQuery(query);

  let queryResponse = await index.query({
    topK: 10,
    vector: queryEmbedding,
    includeMetadata: true,
    includeValues: true,
  });

  console.log(`Found ${queryResponse.matches.length} matches...`);
  console.log(`Asking question: "${query}"...`);

  if (queryResponse.matches.length) {
    // creating OpenAI instance and loading QAStuffChain
    const llm = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const chain = loadQAStuffChain(llm);

    //Extract and concatenate page content from matched documents
    const concatenatedPageContent = queryResponse.matches
      .map((match: any) => match.metadata.pageContent)
      .join(" ");

    const result = await chain.invoke({
      input_documents: [new Document({ pageContent: concatenatedPageContent })],
      question: query,
    });

    console.log(`Answer: ${result.text}`);
    return result.text;
  } else {
    console.log("Since there are no matches, GPT-3 will not be queried.");
  }
};
