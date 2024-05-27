"server-only";

import { HfInference } from "@huggingface/inference"
import { createAI, createStreamableUI, getMutableAIState } from "ai/rsc";
import { PiSpinnerGap } from "react-icons/pi";
import { PromptTemplate } from "@langchain/core/prompts";
import { Message } from "@/components/message";
import { AIState, UIState } from "../chat/types";
import { Actions } from "./types";

const Hf = new HfInference(process.env.HUGGINGFACEHUB_API_TOKEN)

const promptTemplate = `
<|system|>You are a helpful assistant. 
Do not start a new message with \`<|assistant|>\` before ending the previous one with \`<|end|>\`.
Answer just one time only.
Here you have the chat history to keep the responses inside the context of the conversation: {chat_history} <|end|>

<|user|>{input}<|end|>

<|assistant|>
`

export async function SubmitUserMessageToFreeChat(content: string) {
    "use server";

    const aiState = getMutableAIState();
    const messageStream = createStreamableUI(<PiSpinnerGap size={20} className="animate-spin text-muted" />)
    const prompt = await PromptTemplate
        .fromTemplate(promptTemplate)
        .format({
            chat_history: [...aiState.get()],
            input: content
        });

    aiState.update([
        ...aiState.get(),
        {
            role: "user",
            content
        }
    ]);

    const response = await Hf.textGeneration({
        model: "microsoft/Phi-3-mini-4k-instruct",
        inputs: prompt,
        parameters: {
            repetition_penalty: 1,
            truncate: 2000,
            temperature: 0.1,
            return_full_text: false
        }
    });

    const sanitizedResponse = response.generated_text.split("<|end|>")[0];

    aiState.update([
        ...aiState.get(),
        {
            role: "assitant",
            content: sanitizedResponse
        }
    ]);

    messageStream.update(<Message from="ai">{sanitizedResponse}</Message>)
    messageStream.done();
    return {
        id: Date.now().toString(),
        display: messageStream.value,
    }
}

export const AI = createAI<AIState, UIState, Actions>({
    actions: {
        SubmitUserMessageToFreeChat
    },
    initialAIState: [],
    initialUIState: []
});