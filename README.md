This project was done using only `Next.js` (back-end and front-end) - In this <i>"version"</i> <small>`(v0.3-lw)`</small> I'm using `Open AI Embeddings` model and `Open AI` as the provider, using `LangChain` to orchestrate all the data.

# back-end

Everything was done following the [Vercel  AI SDK documentation](https://sdk.vercel.ai/docs).
I'm also using TypeScript for a stronger typing. The model used in the main chat, is the one that Vercel uses in its documentation about Hugging Face, the `OpenAssistant` model,
which is free and open-source. 

I'm accessing this model through `Hugging Face` which now is basically a GitHub for AI models. 
You just need to create an API key in your Hugging Face account and add to your environment variables like this:

```env
HUGGINGFACE_API_TOKEN=hf_secret-key
```

For the Tool Calling you will need an OpenAI API key:

```env
OPENAI_API_KEY=sk-secret-key
```

for the Generative UI, you will need a Together AI API key:

```env
TOGETHER_AI_API_KEY=secret-key
```
for a simple RAG (Retrieval Augmented Generation) you will need a Pinecone API key:

```env
PINECONE_API_KEY=secret-key
```
## Tool Calling (Only works with OpenAI)
There are some models that support `tool calling` but the AI SDK makes the configuration easier for OpenAI. It can also work with other providers and models, but it takes a little more configurations that I not yet know how to set up.

Here is what we want: <i>An AI that is able to access external information such as <b>the weather</b>.</i>

Here is the chat interaction:

<image src="./public/images/tool-calling-chat.png" />

Here is the AI responses `(completion: \AI Response\)`:

<image src="./public/images/tool-calling-console.png" />

In order to do this you have to specify your tools using the Tool interface from your provider, for OpenAI it goes like this:

`app/api/chat-with-tools.ts` (see the full code inside the file in this file path)

```ts
import { Tool } from "ai";

const tools: Tool[] = [
  {
    type: "function",
    function: {
      name: "get_weather_info",
      description:
        "Get the weather information for a specific location when the user asks for it.",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The location to get the weather from.",
          },
          format: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
            description:
              "The temperature unit to use. Infer this from the users location.",
          },
        },
        required: ["location", "format"],
      },
    },
  },
];
```
When creating the chat in the `POST` method in your endpoint, pass the defined tools to it, and set the `tool_choice` to `auto` so the AI decides what tool to use based on the user's input:

```ts
 const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that can access external functions. The responses from these function calls will be appended to this dialogue. Please provide responses based on the information from these function calls.",
      },
      ...messages,
    ],
    tools,
    tool_choice: "auto",
  });
```

After providing the user's input and the tools we just need to get the AI's response and stream the data.

```ts
 const data = new experimental_StreamData();

  const stream = OpenAIStream(response, {
    experimental_streamData: true,
    experimental_onToolCall: async (
      call: ToolCallPayload,
      appendToolCallMessage
    ) => {
      for (const toolCall of call.tools) {
        if (toolCall.func.name === "get_weather_info") {
          //call any API here!!
          const weatherData = {
            temperature: "28º",
            location: toolCall.func.arguments.location
              ? (toolCall.func.arguments.location as string)
              : "",
            unit: toolCall.func.arguments.format === "celsius" ? "C" : "F",
          };

          const newMessages = appendToolCallMessage({
            tool_call_id: toolCall.id,
            function_name: "get_weather_info",
            tool_call_result: weatherData,
          });

          return openai.chat.completions.create({
            model: "gpt-3.5-turbo-0125",
            stream: true,
            messages: [...messages, ...newMessages],
            tools,
            tool_choice: "auto",
          });
        }
      }
    },
    onCompletion(completion) {
      console.log("completion: ", completion);
    },
    onFinal(completion) {
      data.close();
    },
  });


  return new StreamingTextResponse(stream, {}, data);
```

The data stream only works if the `experimental_streamData` property is set to true in the `OpenAIStream`, if it is not, the only output will be in the console. The client is the same as it would be without the tools using the `useChat` hook.

The weather data is hard coded to make the example simple, but it is simple to make an external API call inside the executed function.

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

# Simple RAG with Semantic Search
Everything was done following [this video](https://www.youtube.com/watch?v=6_mfYPPcZ60&t=11s).

Semantic search is a type of search done by `embeddings`, which are vectors that contains many dimensions and numbers representing real-world objects, relationships and context. When an embedding is close to another one, it means they are similar and that is how the semantic search works, when the user asks a question it is converted to a embedding value which is searched in the vector store to get the top 10 or top 5 similar results.

The LLM have our vector store database, in this case [Pinecone](https://docs.pinecone.io/home) as a source to answer the user's questions. Here is the workflow, we setup a `documents` folder in our root folder, read all the files there, break each text content inside them into chunks, convert this chunks into embedding values, them make a query function to search for what you want. In this case I just put one file about dividends from [Trading212](https://www.trading212.com/learn/dividends). 

------------
The embeddings and the response generation are done by OpenAI embeddings (with a vector dimension of 1536) and chat. It can be changed to Mistral's `mistral-embed` (with a vector dimension of 1024) which costs $0.10 (dolars) per million tokens and the same Mistral model used in other examples to be the chat, using it by Together AI. This would be the best way in terms of cost and benefit I belive.
------------
The downside is that to use `mistral-embed` you must use by Mistral's endpoint which can only be used if you pay them, passing your credit card information which I didn't want to do.

Here is how it works:

https://github.com/Saraivinha1703/nextjs-ai-chat/assets/62428073/2bdca75b-31e1-4aa9-bd9e-2c927540371b

The main functions are in the `app/lib/utils` folder, those functions are used to create, update and query into our vetor store in Pinecone, all the responses are based on the data from our `dividend.txt` file.

## RAG Chat
There are different ways to do a RAG chat, I decided to use the retrieval as a tool, since I wanted the AI to be a little more *human* with some generic messages like greeting and polity responses. I also wanted it to have tools with external access, being able to call APIs. Here is how it works:

It can talk about finance (limited by the documents in `documents/financial`) according to the informating it have in the vector store, doing a semantic search to choose the best answer:

https://github.com/Saraivinha1703/nextjs-ai-chat/assets/62428073/8c7bc277-0f5c-4399-bcea-21e007bc0023

It can retrieve possible stocks symbols according to the name of the company, you can also see the price for some stocks (the API returns an empty string in some of them, but this have a validation) and if you pass an invalid name of a company it also have a custom message, but those validations are made in the tool and not by the LLM: 

https://github.com/Saraivinha1703/nextjs-ai-chat/assets/62428073/6a0dc035-2195-4f5c-8052-9872b07c0e8f

It can also get stock prices if the user passes a stock symbol. It has some issue with the stock symbol if it has numbers, but it may be the prompt, which makes the LLM do a validation (will be fixed):

https://github.com/Saraivinha1703/nextjs-ai-chat/assets/62428073/c7261828-38ce-443b-a922-77cc0ab5993c

To develop this RAG is basically do a simple RAG QA and use it as a tool as I did before in the Generative UI, which use tools to call *external* APIs. You can see all the files that make it work in `src/lib/rag-chat` folder.

# front-end

I'm using `TailwindCSS` which comes by default with Next.js, `shadcn/ui`, to have base components ready and styled quickly and `next-themes` to provide themes to my application.

## Tool Calling

In order to develop a tool calling chat with the AI SDK you just need to make the same structure as a regular chat but with the endpoint to your chat with tools if it is not in the default endpoint which is `api/chat`.

```ts
  const { messages, input, handleInputChange, handleSubmit } = useChat({api: 'api/chat-with-tools'});
```

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

# Simple RAG with Semantic Search
In the front-end we just need to make buttons trigger the routes that executes our functions.
These are the functions that call our routes:

```ts
    async function createIndexAndEmbeddings() {
        try {
            const result = await fetch("/api/semantic-search/setup", {
              method: "GET",
            });

            const json = await result.json();
            console.log("result: ", json);
        } catch (e) {
            console.error("error: ", e)
        }
    }

    async function sendQuery() {
        if(!query) return;

        setResult("");
        setLoading(true);

        try {
          const result = await fetch("api/semantic-search/read", {
            method: "POST",
            body: JSON.stringify({query}),
          });

          const json = await result.json();
          setResult(json.data);
          setQuery("");
        } catch (e) {
            console.error("error: ", e);
        } finally {
            setLoading(false);
        }
    }
```

## RAG Chat

The front-end is pretty similar with the Generative UI chat, you can check out the `app/rag-chat/fragments/rag-chat.tsx` file, or the Generative UI documentation.

# Extra
Have fun chating with the **AI**, just be careful with what you wish for ☠️☠️

![image](https://github.com/Saraivinha1703/nextjs-ai-chat/assets/62428073/e4d29f63-95ba-42cb-94ad-b466c0240259)
