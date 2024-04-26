'use client'

import { Message } from "@/components/message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AI } from "@/lib/free-chat/actions";
import { cn } from "@/lib/utils";
import { useActions, useUIState } from "ai/rsc";
import { useEffect, useRef, useState } from "react";
import { PiPaperPlaneTilt, PiRobotThin } from "react-icons/pi";

export function Chat() {
  const bottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useUIState<typeof AI>();
  const { SubmitUserMessageToFreeChat } = useActions<typeof AI>();

  const [input, setInput] = useState<string>("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  async function handleSubmit() {
    if(input === "") return;
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
    const responseMessage = await SubmitUserMessageToFreeChat(input);
    setMessages((currentMessages) => [...currentMessages, responseMessage]);

    setInput("");
  }
  return (
    <div className="flex flex-col w-full max-w-xl px-4 h-[calc(100vh-4rem)] justify-between items-center mx-auto">
      <div className="flex flex-col w-full max-w-xl max-h-[calc(100%-4.5rem)] pt-6">
        <span className="w-full text-center text-sm text-muted">
        microsoft/Phi-3-mini-4k-instruct
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
            {messages.map((m) => (
              <div key={m.id}>
                  {m.display}
              </div>
            ))}
            <div ref={bottomRef}/>
          </div>
        )}
      </div>
      <form action={handleSubmit} className="w-full">
        <div className="flex gap-2 w-full py-4">
          <Input
            className="p-2 border border-input rounded shadow-sm bg-background"
            value={input}
            placeholder="Say something..."
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            type="submit"
            size="icon"
            className="bg-gradient-to-tr from-secondary to-primary"
          >
            <PiPaperPlaneTilt size={20} />
          </Button>
        </div>
      </form>
    </div>
  );
}