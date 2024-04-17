import { WeekWeatherSkeleton } from "@/components/week-weather/week-weather-skeleton";
import { ExperimentalTool } from "ai";
import { createStreamableUI } from "ai/rsc";
import { z } from "zod";
import { sleep } from "../utils";
import { WeeakWeather } from "@/components/week-weather";
import { getWeather } from "./external-apis";

export function generateTools(messageStream: ReturnType<typeof createStreamableUI>) {
  const tools: Record<string, ExperimentalTool<any, any>> = {
    getWeatherInfo: {
      description:
        "Get the information for the weather according to a certain location.",
      parameters: z.object({
        location: z.string().describe("The location to get the weather from. It must be a string value."),
      }),
      execute: async ({location}) => {
        messageStream.update(<WeekWeatherSkeleton />);

        const weatherInfo = await getWeather();

        await sleep(2000);

        messageStream.update(
          <WeeakWeather location={location} weather={weatherInfo.weather} />
        );
      }
    }
  };

  return tools; 
}
