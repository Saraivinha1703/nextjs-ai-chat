import { OpenAIStream, StreamingTextResponse, Tool, ToolCallPayload, experimental_StreamData  } from "ai";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  fetch: async (url, init) => {
    console.log(url);
    console.log(init?.body);
    const response = await fetch(url, init);
    return new Response(response.body);
  },
});

export const runtime = "edge";

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

export async function POST(req: Request) {
  console.log("server")
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
    onFinal() {
      data.close();
    },
  });


  return new StreamingTextResponse(stream, {}, data);
}