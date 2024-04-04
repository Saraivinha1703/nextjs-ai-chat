"use client";

import { useState } from "react";
import { useUIState, useActions } from "ai/rsc";
import type { AI } from "../../action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PiPaperPlaneTilt } from "react-icons/pi";

export function GenerativeUIChat() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();

  return (
    <div className="max-w-xl mx-auto">
      {
        // View messages in UI state
        messages.map((message) => (
          <div key={message.id}>{message.display}</div>
        ))
      }

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          // Add user message to UI state
          setMessages((currentMessages) => [
            ...currentMessages,
            {
              id: Date.now(),
              display: <div>{inputValue}</div>,
            },
          ]);

          // Submit and get response message
          const responseMessage = await submitUserMessage(inputValue);
          setMessages((currentMessages) => [
            ...currentMessages,
            responseMessage,
          ]);

          setInputValue("");
        }}
      >
        <div className="flex gap-2 w-full py-4">
          <Input
            className="p-2 border border-input rounded shadow-sm bg-background"
            value={inputValue}
            placeholder="Say something..."
            onChange={(event) => {
              setInputValue(event.target.value);
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
