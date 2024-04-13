This project was done using only `Next.js` (back-end and front-end) - In this <i>"version"</i> <small>`(v0.2-lw)`</small> I'm using `Mistral` model and `Together AI` as the provider.

Currently to work with Generative UI, Vercel's AI SDK only supports OpenAI with their `render` function
which you can check out in their documentation about [Generative UI](https://sdk.vercel.ai/docs/concepts/ai-rsc). You can also check out their blog post announcing their AI SDK 3.0 and their SaaS v0 [here](https://vercel.com/blog/ai-sdk-3-generative-ui), but there is another way to make Generative UI without the `render` function.

# back-end

Everything was done following the [Vercel  AI SDK documentation](https://sdk.vercel.ai/docs).
I'm also using TypeScript for a stronger typing. The model used in the main chat, is the one that Vercel uses in its documentation about Hugging Face, the `OpenAssistant` model,
which is free and open-source. 

I'm accessing this model through `Hugging Face` which now is basically a GitHub for AI models. 
You just need to create an API key in your Hugging Face account and add to your environment variables like this:

```env
HUGGINGFACE_API_TOKEN="hf_secret-key"
```

For the Tool Calling you will need an OpenAI API key:
```env
OPENAI_API_KEY="sk-secret-key"
```

and for the Generative UI, you will need a Together AI API key:
```env
TOGETHER_AI_API_KEY="secret-key"
```

## Generative UI
With Generative UI we want an AI that is able to access external APIs, in this case, it is able to tell weather information, the only difference is that it streams components to render with the information, which opens more possibilities to external API calls by clicking in buttons in the generated components. 

The streaming only works with OpenAI, in this case we are going to use Together AI as the provider along with the Mistral model, `mistralai/Mixtral-8x7B-Instruct-v0.1`. See Together AI models that support tool calling [here](https://docs.together.ai/docs/function-calling).

Here is how it should work:

https://github.com/Saraivinha1703/nextjs-ai-chat/assets/62428073/b0b0056d-96a5-4183-ac7b-8104379388d4

This feature was developed based on Vercel's Google Generative UI chat, so in order to develop this feature you just need to check [their repository](https://github.com/vercel-labs/gemini-chatbot/blob/main/lib/chat/actions.tsx) and my file in `src/lib/chat/actions.tsx`.

Note that with the Mistral interface and Together AI as the provider, the `experimental_streamText` will not work (or maybe it does work if you find a way - tell me if you do 😔), so the other way is to use `experimental_generateText` which does not stream the LLM response and just deliver the response when it is done.

 In order to this work on the client side, we need to create the AI provider with the server actions, initial UI and AI state.

 ```ts
 export const AI = createAI<AIState, UIState, Actions>({
  actions: {
    submitUserMessage,
  },
  initialAIState: [],
  initialUIState: [],
});
 ```

The client side is a bit different when using Generative UI, check out the `front-end/Generative UI` section.

# front-end

I'm using `TailwindCSS` which comes by default with Next.js, `shadcn/ui`, to have base components ready and styled quickly and `next-themes` to provide themes to my application.

## Generative UI

The client needs to consume the AI provider, like this:
```ts
import { AI } from "../../lib/chat/actions";
import { GenerativeUIChat } from "./fragments/generative-ui-chat";

export default function GenerativeUIPage() {
  return (
    <AI>
      <GenerativeUIChat />
    </AI>
  );
}

```
Here is the `GenerativeUIChat` component:

```ts
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
                {message.display}
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

```
The important part here is how we render the messages which is with the `display` property returned from the server action and adding the user's input to the UI in the `handleSubmit` method.

# Extra
Have fun chating with the **AI**, just be careful with what you wish for ☠️☠️

![image](https://github.com/Saraivinha1703/nextjs-ai-chat/assets/62428073/e4d29f63-95ba-42cb-94ad-b466c0240259)
