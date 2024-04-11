import 'server-only';

import { createAI, createStreamableUI, createStreamableValue, getAIState, getMutableAIState } from 'ai/rsc';
import { experimental_generateText } from 'ai';
import { PiSpinnerGap } from 'react-icons/pi';
import { Mistral } from "ai/mistral"
import { z } from 'zod';
import { WeeakWeather } from '@/components/week-weather';
import { Message } from '@/components/message';
import { WeekWeatherSkeleton } from '@/components/week-weather/week-weather-skeleton';
import { sleep } from '../utils';

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

const togetherai = new Mistral({
  apiKey: process.env.TOGETHER_AI_API_KEY,
  baseUrl: "https://api.together.xyz/v1",
});

export async function submitUserMessage(content: string) {
    "use server";

    const aiState = getMutableAIState()
    
    // adding user message
    aiState.update([
        ...aiState.get(),
        {
            id: Date.now().toString(),
            role: "user",
            content
        }
    ]);

    //gettin history -> previous and current user messages
    const history = aiState.get().map((message: ChatMessage) => ({
      role: message.role,
      content: message.content,
    }));

    //console.log(history);

    //not sure what this is used for
    const textStream = createStreamableValue('');
    const loadingStream = createStreamableUI(<PiSpinnerGap className='animate-spin text-muted' size={30} />);
    const messageStream = createStreamableUI(null);
    const uiStream = createStreamableUI();

    (async () => {
        try {
            const result = await experimental_generateText({
              model: togetherai.chat("mistralai/Mixtral-8x7B-Instruct-v0.1"),
              temperature: 0,
              tools: {
                getWeatherInfo: {
                  description:
                    "Get the information for the weather according to a certain location.",
                  parameters: z.object({
                    location: z
                      .string()
                      .describe("The location to get the weather from."),
                  }),
                  execute: async ({location}) => {
                    console.log("----------------------------------------");
                    console.log("tool being executed!!!");
                    console.log(location);
                    console.log("----------------------------------------");
                    loadingStream.done(null);
                    messageStream.update(<WeekWeatherSkeleton />)
                    
                    const weatherInfo = await getWeather();

                    await sleep(2000);

                    messageStream.update(<WeeakWeather location={location} weather={weatherInfo.weather} />);
                  }
                },
              },
              system: `You are a helpful assistant that can access external functions when the user asks for. Your name is Mistral AI.
                If the user asks for the weather and passes the location, call \`getWeatherInfo\` to show current weather at that location.`,
              messages: [...history],
            });

            
            console.log("result warnings: ", result.warnings);
            console.log("result: ", result);
            
            if (result.finishReason === 'other') {
              loadingStream.done(null);
              messageStream.update(<Message from="ai">{result.text}</Message>);
            }

            aiState.update([
              ...aiState.get(),
              {
                id: Date.now().toString(),
                role: 'assistant',
                content: result.text
              }
            ])

            uiStream.done();
            textStream.done();
            messageStream.done();
        } catch(e) {
            console.error(e);

            const error = new Error('An error occured during the LLM execution.');
            uiStream.error(error);
            textStream.error(error);
            messageStream.error(error);
            aiState.done([]);
        }
    })();

    return {
      id: Date.now().toString(),
      attachments: uiStream.value,
      loading: loadingStream.value,
      display: messageStream.value,
    };
}

export type ChatMessage = {
  role: "user" | "assistant" | "system" | "function" | "data" | "tool";
  content: string;
  id?: string;
  name?: string;
  display?: {
    name: string;
    props: Record<string, any>;
  };
};

export type AIState = ChatMessage[];

export type UIState = {
  id: string;
  display: React.ReactNode;
  loading?: React.ReactNode;
  attachments?: React.ReactNode;
}[];

type Actions = {
  submitUserMessage: (content: string) => Promise<{
     id: string,
      attachments: JSX.Element,
      loading: JSX.Element,
      display: JSX.Element,
  }>;
};

export const AI = createAI<AIState, UIState, Actions>({
  actions: {
    submitUserMessage,
  },
  initialUIState: [] as UIState,
  initialAIState: [] as AIState,
});