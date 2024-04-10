import "server-only";

import { Message } from "@/components/message";
import { getMutableAIState, render, createAI } from "ai/rsc";
import OpenAI from "openai";
import { PiCloudSun, PiSpinnerGap, PiSun, PiSunDim } from "react-icons/pi";
import { z } from "zod";
import { sleep } from "@/lib/utils";
import { randomUUID } from "crypto";
import { WeeakWeather } from "@/components/week-weather";
import { WeekWeatherSkeleton } from "@/components/week-weather/week-weather-skeleton";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getWeather() {
  //Make an API Call here!!
  return {
    weather: {
      monday: "30ºC",
      tuesday: "28ºC",
      wednesday: "32ºC",
      thursday: "29ºC",
      friday: "27ºC",
      saturday: "28ºC",
      sunday: "29ºC",
    },
  };
}

async function submitUserMessage(input: string) {
  "use server";
  
  const aiState = getMutableAIState<typeof AI>();

  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content: input,
    },
  ]);

  const ui = render({
    provider: openai,
    model: "gpt-3.5-turbo-0125",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant that can access external functions when the user asks for. Your name is Mistral AI.
          If the user asks for the weather and passes the location, call \`getWeatherInfo\` to show current weather at that location.`,
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
        parameters: z.object({
          location: z
            .string()
            .describe("The location to get the weather from."),
        }),
        render: async function* ({ location }) {
          yield <WeekWeatherSkeleton />;

          //can call from other func to get information from an external api
          const weatherInfo = await getWeather();

          await sleep(2000);

          aiState.done([
            ...aiState.get(),
            {
              id: randomUUID(),
              role: "function",
              name: "getWeatherInfo",
              content: JSON.stringify(weatherInfo),
            },
          ]);

          return (
            <WeeakWeather location={location} weather={weatherInfo.weather} />
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