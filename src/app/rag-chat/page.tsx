"use client";

import { Message } from "@/components/message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { PiRobotThin, PiSpinnerGapLight } from "react-icons/pi";

export default function RAGChatPage() {
  const [query, setQuery] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [sources, setSources] = useState<string[] | undefined>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function createIndexAndEmbeddings() {
    try {
      const result = await fetch("/api/rag-chat/setup", {
        method: "GET",
      });

      const json = await result.json();
      console.log("result: ", json);
    } catch (e) {
      console.log("error: ", e);
    }
  }

//   async function sendQuery() {
//     if (!query) return;

//     setResult("");
//     setLoading(true);

//     try {
//       const result = await fetch("api/simple-rag/read", {
//         method: "POST",
//         body: JSON.stringify({ query }),
//       });

//       const json = await result.json();
//       setResult(json.data);
//       setQuery("");
//     } catch (e) {
//       console.log("error: ", e);
//     } finally {
//       setLoading(false);
//     }
//   }

  return (
    <main className="flex h-full flex-col items-center justify-between p-4 sm:p-8">
      <h1 className="font-bold text-2xl w-full text-center p-2 bg-clip-text bg-gradient-to-br from-30% from-teal-500 via-50% via-sky-500 to-70% to-purple-500 text-transparent sm:p-12">
        Chat with OpenAI about the Roman Empire.
      </h1>
      {loading && (
        <p className="flex gap-2">
          <span>Asking AI</span>
          <PiSpinnerGapLight size={20} className="animate-spin text-muted" />
        </p>
      )}
      <div className="flex flex-col w-full max-w-xl max-h-[52vh]">
        {messages.length === 0 ? (
          <div className="flex flex-col w-full items-center">
            <PiRobotThin size={80} />
          </div>
        ) : (
          <div
            className={cn(
              "[&::-webkit-scrollbar]:w-[0.35rem] [&::-webkit-scrollbar-track]:bg-accent [&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-thumb:hover]:bg-primary/50",
              "p-2 px-6 pr-3 flex flex-col gap-4 border border-input rounded-lg mb-2 overflow-auto shadow-sm shadow-black/30 transition duration-300 hover:shadow-lg"
            )}
          >
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={cn("flex w-full", message.role === "user" ? "justify-end": "")}
              >
                <Message from={message.role === "assistant" ? "ai" : "user"} sources={sources}>
                  {message.content}
                </Message>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex my-4 gap-2">
        <Input
          disabled={loading}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button disabled={loading} variant="outline">
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
