import 'server-only';

import { createAI, createStreamableUI, getMutableAIState } from 'ai/rsc';
import { ExperimentalMessage, experimental_generateText } from 'ai';
import { PiSpinnerGap } from 'react-icons/pi';
import { Mistral } from "ai/mistral"
import { Message } from '@/components/message';
import { AIState, Actions, ChatMessage, UIState } from './types';
import { generateTools } from './tools';

const togetherai = new Mistral({
  apiKey: process.env.TOGETHER_AI_API_KEY,
  baseUrl: "https://api.together.xyz/v1",
});

async function getResult(history: ExperimentalMessage[], messageStream: ReturnType<typeof createStreamableUI>) {
  return await experimental_generateText({
    model: togetherai.chat("mistralai/Mixtral-8x7B-Instruct-v0.1"),
    temperature: 0,
    tools: generateTools(messageStream),
    system: `You are a helpful assistant that can access external information through your tools.
    You can get weather infomation when the user asks for it passing the location in string, it can not be a numerical value, using \`getWeatherInfo\`
    Your name is Mistral AI.`,
    messages: [...history],
  });
}

async function submitUserMessage(content: string) {
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

    //creating streamable message with a initial loading component
    const messageStream = createStreamableUI(
      <PiSpinnerGap className="animate-spin text-muted" size={30} />
    );

    (async () => {
        try {
            const result = await getResult(history, messageStream);
            
            console.log("result warnings: ", result.warnings);
            console.log("result: ", result);
            
            if (result.finishReason === 'other') {
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

            messageStream.done();
        } catch(e) {
            console.error(e);
            const error = new Error('An error occured during the LLM execution.');
            messageStream.error(error);
            aiState.done([]);
        }
    })();

    return {
      id: Date.now().toString(),
      display: messageStream.value,
    };
}

export const AI = createAI<AIState, UIState, Actions>({
  actions: {
    submitUserMessage,
  },
  initialUIState: [] as UIState,
  initialAIState: [] as AIState,
});
