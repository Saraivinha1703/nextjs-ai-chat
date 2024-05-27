import 'server-only';

import { createAI, createStreamableUI, getMutableAIState } from "ai/rsc";
import { PiSpinnerGap } from "react-icons/pi";
import { Message } from "@/components/message";
import { AIState, ChatMessage, UIState } from "../chat/types";
import { getResult } from "./main";
import { Actions } from './types';

async function submitUserMessageRAGChat(content: string) {
  "use server";

  const aiState = getMutableAIState();

  // adding user message
  aiState.update([
    ...aiState.get(),
    {
      id: Date.now().toString(),
      role: "user",
      content,
    },
  ]);

  //gettin history -> previous and current user messages
  const history = aiState.get().map((message: ChatMessage) => ({
    role: message.role,
    content: message.content,
  }));

  //creating streamable message with a initial loading component
  const messageStream = createStreamableUI(
    <PiSpinnerGap className="animate-spin text-muted" size={30} />
  );

  (async () => {
    try {
      const result = await getResult(history, messageStream);

      console.log("result warnings: ", result.warnings);
      console.log("result: ", result);

      if (result.finishReason === "other") {
        messageStream.update(<Message from="ai">{result.text}</Message>);
      }

      aiState.update([
        ...aiState.get(),
        {
          id: Date.now().toString(),
          role: "assistant",
          content: result.text,
        },
      ]);

      messageStream.done();
    } catch (e) {
      console.error(e);
      const error = new Error("An error occured during the LLM execution.");
      messageStream.error(error);
      aiState.done([]);
    }
  })();

  return {
    id: Date.now().toString(),
    display: messageStream.value,
  };
}

export const AI = createAI<AIState, UIState, Actions>({
  actions: {
    submitUserMessageRAGChat,
  },
  initialUIState: [] as UIState,
  initialAIState: [] as AIState,
});
