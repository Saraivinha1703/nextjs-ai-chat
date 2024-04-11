import { HfInference } from "@huggingface/inference";
import { HuggingFaceStream, StreamingTextResponse } from "ai";
import { experimental_buildOpenAssistantPrompt } from "ai/prompts";

const Hf = new HfInference(process.env.HUGGINGFACEHUB_API_TOKEN);

export const runtime = "edge";

export async function POST(req: Request) {
    const { prompt } = await req.json();
    const response = Hf.textGenerationStream({
      model: "google/flan-t5-xxl",
      inputs: prompt,
      parameters: {
        max_new_tokens: 1024,
        temperature: 0.4,
        repetition_penalty: 1,
        truncate: 1000,
        return_full_text: false,
      },
    });

    const stream = HuggingFaceStream(response);
    return new StreamingTextResponse(stream);
}
