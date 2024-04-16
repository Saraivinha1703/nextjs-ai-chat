import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone"
import { queryPineconeVectorStoreAndLLM } from "@/lib/utils";
import { pineconeIndexName } from "../../../../../config";

const client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || "" });

export async function POST(req: NextRequest) {
    try {
        const { query }: { query: string } = await req.json();
        
        const text = await queryPineconeVectorStoreAndLLM(client, pineconeIndexName, query);
        
        return NextResponse.json({data: text});

    } catch(e: any) {
        console.error(e);
        console.error(e.message);
    }
}