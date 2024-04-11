import { ExperimentalTool } from "ai";
import { z } from "zod";

export const tools: Record<string, ExperimentalTool<any, any>> = {
  getWeatherInfo: {
    description:
      "Get the information for the weather according to a certain location.",
    parameters: z.object({
      location: z.string().describe("The location to get the weather from."),
    }),
    execute: async ({location}) => {}
  },
};