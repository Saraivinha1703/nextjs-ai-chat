import "server-only";

import { Message } from "@/components/message";
import { getMutableAIState, render, createAI } from "ai/rsc";
import OpenAI from "openai";
import { PiSpinnerGap } from "react-icons/pi";
import { z } from "zod";
import { sleep } from "@/lib/utils";

const togetherai = new OpenAI({
  apiKey: process.env.TOGETHER_AI_API_KEY,
  baseURL: "https://api.together.xyz/v1",
});

//export const runtime = "edge";

async function getWeather() {
  return {weather: "30º"}
}

async function submitUserMessage(input: string) {
  "use server";
  
  const aiState = getMutableAIState();

  // Update AI state with new message.
  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content: input,
    },
  ]);

  const ui = render({
    provider: togetherai,
    model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant that can access external functions when the user asks for. Your name is MistralAI.
          If the user asks for the weather and passes the location, call \`get_weather_info\` to show current weather at that location.`,
      },
      {
        role: "user",
        content: input,
      },
    ],
    text: ({ content, done }) => {
      if (done) {
        aiState.done([
          ...aiState.get(),
          {
            role: "assistant",
            content,
          },
        ]);
      }

      return (
        <div className="flex w-full">
          <Message from="ai">{content}</Message>
        </div>
      );
    },
    initial: (
      <div>
        <PiSpinnerGap className="animate-spin text-muted" size={25} />
      </div>
    ),
    functions: {
      getWeatherInfo: {
        description:
          "Get the information for the weather according to a certain location.",
        parameters: z
          .object({
            location: z
              .string()
              .describe("The location to get the weather from."),
          })
          .required(),
        render: async function* ({ location }) {
          yield (
            <div>
              <PiSpinnerGap className="animate-spin text-muted" size={25} />
            </div>
          );

          //can call from other func to get information from an external api
          const weatherInfo = await getWeather();
          
          await sleep(1000);

          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "getWeatherInfo",
              content: JSON.stringify(weatherInfo),
            },
          ]);

          return (
            <div className="bg-red-500">
              <h1>
                The weather in <span className="font-bold">{location}</span>
              </h1>
              <div>is {weatherInfo.weather}</div>
            </div>
          );
        },
      },
    },
  });

  return {
    id: Date.now(),
    display: ui,
  };
}

// Define the initial state of the AI. It can be any JSON object.
const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];

// The initial UI state that the client will keep track of, which contains the message IDs and their UI nodes.
const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

export const AI = createAI({
  actions: {
    submitUserMessage,
  },
  initialAIState,
  initialUIState,
});
