"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { PiRobotThin, PiSpinnerGapLight } from "react-icons/pi";

export default function SimpleRAGPage() {
    const [query, setQuery] = useState<string>("");
    const [result, setResult] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    
    async function createIndexAndEmbeddings() {
        try {
            const result = await fetch("/api/simple-rag/setup", {
              method: "GET",
            });

            const json = await result.json();
            console.log("result: ", json);
        } catch (e) {
            console.log("error: ", e)
        }
    }

    async function sendQuery() {
        if(!query) return;

        setResult("");
        setLoading(true);

        try {
          const result = await fetch("api/simple-rag/read", {
            method: "POST",
            body: JSON.stringify({query}),
          });

          const json = await result.json();
          setResult(json.data);
          setQuery("");
        } catch (e) {
            console.log("error: ", e);
        } finally {
            setLoading(false);
        }
    }

    return (
      <main className="flex h-full flex-col items-center justify-between p-4 sm:p-8">
        <h1 className="font-bold text-2xl w-full text-center p-2 bg-clip-text bg-gradient-to-br from-30% from-teal-500 via-50% via-sky-500 to-70% to-purple-500 text-transparent sm:p-12">
          Ask about dividend with OpenAI Embeddings and Pinecone vector store.
          <br />
          <span className="font-light text-sm bg-opacity-70">
            (Dividend document from Trading212)
          </span>
        </h1>
        {loading && (
          <p className="flex gap-2">
            <span>Asking AI</span>
            <PiSpinnerGapLight size={20} className="animate-spin text-muted" />
          </p>
        )}
        {result ? (
          <div className="flex flex-col m-2 w-full ring-1 ring-primary rounded-md sm:w-1/2">
            <span className="w-full border-b border-muted p-2 font-semibold text-primary">
              AI
            </span>
            <p className="py-2 px-4">{result}</p>
          </div>
        ) : loading ? (
          <></>
        ) : (
          <PiRobotThin size={80} className="animate-bounce" />
        )}
        <div className="flex my-4 gap-2">
          <Input
            disabled={loading}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button disabled={loading} variant="outline" onClick={sendQuery}>
            Ask AI
          </Button>
        </div>

        <Button
          disabled={loading}
          onClick={createIndexAndEmbeddings}
          className="bg-gradient-to-tr from-secondary to-primary"
        >
          Create index and embeddings
        </Button>
      </main>
    );
}