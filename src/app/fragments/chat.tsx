'use client'

import { Message } from "@/components/message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import { LuSend } from "react-icons/lu";
import { PiRobotLight } from "react-icons/pi";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  
  return (
    <div className="flex flex-col w-full max-w-xl py-8 pb-24 mx-auto stretch">
        {
        messages.length === 0 
        ? (
            <div className="flex flex-col gap-8 w-full items-center">
                <span className="text-2xl font-semibold">Start a conversation with the AI.</span>
                <PiRobotLight size={80} />
            </div>
        ) :
        <div className="p-2 px-6 flex flex-col gap-4 border border-input rounded-lg mb-2">
            {messages.map((m) => (
            <div
                key={m.id}
                className={cn(
                "flex w-full",
                m.role === "user" ? "justify-end" : ""
                )}
            >
                <Message from={m.role === "user" ? "user" : "ai"}>
                {m.content}
                </Message>
            </div>
            ))}
        </div>
        }

      <form onSubmit={handleSubmit}>
        <div className="fixed flex gap-2 bottom-0 w-full max-w-xl bg-background/90 p-2 py-8 rounded-lg backdrop-blur-sm supports-[backdrop-filter]:bg-background/50">
          <Input
            className="p-2 border border-input rounded shadow-sm bg-background"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
          <Button size="icon">
            <LuSend size={20} />
          </Button>
        </div>
      </form>
    </div>
  );
}