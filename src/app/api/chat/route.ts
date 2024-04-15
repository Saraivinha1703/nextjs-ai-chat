import { StreamingTextResponse, LangChainStream, Message } from "ai";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { HuggingFaceInference } from "@langchain/community/llms/hf";
export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const { stream, handlers } = LangChainStream();

  const llm = new HuggingFaceInference({
    model: "bigcode/santacoder",
    apiKey: process.env.HUGGINGFACEHUB_API_KEY, // In Node.js defaults to process.env.HUGGINGFACEHUB_API_KEY
  });

  llm
    .stream(
      (messages as Message[]).map((m) =>
        m.role == "user"
          ? new HumanMessage(m.content)
          : new AIMessage(m.content)
      ), {callbacks: [handlers]}
    )
    .catch(console.error);
  return new StreamingTextResponse(stream);
}
