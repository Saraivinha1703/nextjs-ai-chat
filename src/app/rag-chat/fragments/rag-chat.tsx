"use client";

import { Message } from "@/components/message";
import { MessageSkeleton } from "@/components/message/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AI } from "@/lib/rag-chat/actions";
import { cn } from "@/lib/utils";
import { useActions, useUIState } from "ai/rsc";
import { useState } from "react";
import { PiPaperPlaneTilt, PiRobotThin } from "react-icons/pi";

export function RAGChat() {
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessageRAGChat } = useActions<typeof AI>();

  const [input, setInput] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Add user message to UI state
    setMessages((curr) => [
      ...curr,
      {
        id: Date.now().toString(),
        display: (
          <div className="flex w-full justify-end">
            <Message from="user">{input}</Message>
          </div>
        ),
      },
    ]);

    // Submit and get response message
    const responseMessage = await submitUserMessageRAGChat(input);
    setMessages((currentMessages) => [...currentMessages, responseMessage]);

    setInput("");
  }

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

  return (
    <div className="flex flex-col w-full max-w-xl px-4 h-[calc(100vh-4rem)] justify-between items-center mx-auto">
      <div className="flex flex-col w-full max-w-xl max-h-[calc(100%-8rem)] pt-6">
        <span className="w-full text-center text-sm text-muted">
          mistralai/Mixtral-8x7B-Instruct-v0.1
        </span>
        {messages.length === 0 ? (
          <div className="flex flex-col gap-8 w-full items-center">
            <span className="text-2xl font-semibold text-center">
              Start a conversation with the AI.
            </span>
            <PiRobotThin size={100} />
          </div>
        ) : (
          <div
            className={cn(
              "[&::-webkit-scrollbar]:w-[0.35rem] [&::-webkit-scrollbar-track]:bg-accent [&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-thumb:hover]:bg-primary/50",
              "p-2 px-6 pr-3 flex flex-col gap-4 border border-input rounded-lg mb-2 overflow-auto shadow-sm shadow-black/30 transition duration-300 hover:shadow-lg"
            )}
          >
            {messages.map((message) => (
              <div key={message.id}>{message.display}</div>
            ))}
          </div>
        )}
      </div>
        <form className="w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 items-center pb-2">
                <div className="flex gap-2 w-full py-4">
                <Input
                    className="p-2 border border-input rounded shadow-sm bg-background"
                    value={input}
                    placeholder="Say something..."
                    onChange={(event) => {
                        setInput(event.target.value);
                    }}
                    />
                <div className="w-fit p-[0.05rem] bg-gradient-to-tr from-secondary to-primary rounded-md">
                    <Button type="submit" size="icon" variant="outline">
                    <PiPaperPlaneTilt size={20} className="text-primary" />
                    </Button>
                </div>
                </div>
                <Button
                    type="button"
                    onClick={createIndexAndEmbeddings}
                    size="sm"
                    className="bg-gradient-to-tr from-secondary font-semibold to-primary w-fit"
                    >
                    Create index and embeddings
                </Button>
            </div>
        </form>
    </div>
  );
}
