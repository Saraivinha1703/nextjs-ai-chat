import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { createPineconeIndex, updatePineconeIndex } from "@/lib/pinecone";
import { Document } from "langchain/document";
import { pineconeRAGChatIndex } from "../../../../../config";

const client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || "" });

export async function GET() {
  const vectorDimensions = 1536;
  const docs: Document<Record<string, any>>[] = [];

  try {
    const loader = new DirectoryLoader("./documents/roman-empire", {
      ".txt": (path) => new TextLoader(path),
      ".md": (path) => new TextLoader(path),
      ".pdf": (path) => new PDFLoader(path),
    });

    docs.push(...(await loader.load()));
  } catch (err) {
    console.error("Loading files error: ", err);
  }

  try {
    await createPineconeIndex(client, pineconeRAGChatIndex, vectorDimensions);
    await updatePineconeIndex(client, pineconeRAGChatIndex, docs);

    return NextResponse.json({
      data: "successfully created index and loaded data into Pinecone...",
    });
  } catch (err) {
    console.error("Pinecone create or update error: ", err);
  }
}
