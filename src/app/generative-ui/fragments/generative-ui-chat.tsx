"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PiPaperPlaneTilt, PiRobotThin } from "react-icons/pi";
import { useUIState, useActions } from "ai/rsc";
import { useState } from "react";
import { AI } from "@/lib/chat/actions";
import { Message } from "@/components/message";

export function GenerativeUIChat() {
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();

  const [input, setInput] = useState<string>('');

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
    const responseMessage = await submitUserMessage(input);
    setMessages(currentMessages => [...currentMessages, responseMessage]);

    setInput('');
  }

  return (
    <div className="flex flex-col w-full max-w-xl px-4 h-[calc(100vh-4rem)] justify-between items-center mx-auto">
      <div className="flex flex-col w-full max-w-xl max-h-[calc(100%-4.5rem)] pt-6">
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
              <div key={message.id}>
                {message.loading}
                {message.display}
                {message.attachments}
              </div>
            ))}
          </div>
        )}
      </div>
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="flex gap-2 w-full py-4">
          <Input
            className="p-2 border border-input rounded shadow-sm bg-background"
            value={input}
            placeholder="Say something..."
            onChange={(event) => {
              setInput(event.target.value);
            }}
          />
          <Button size="icon">
            <PiPaperPlaneTilt size={20} />
          </Button>
        </div>
      </form>
    </div>
  );
}
