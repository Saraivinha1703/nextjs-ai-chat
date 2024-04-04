import { Skeleton } from "@/components/ui/skeleton";
import { HfInference } from "@huggingface/inference";
import { createAI, getMutableAIState, render } from "ai/rsc";
import { z } from "zod";

type InitialAIStateProps = {
    role: 'user' | 'assistant' | 'system' | 'function';
    content: string;
    id?: string;
    name?: string;
}

type InitialUIStateProps = {
    id: number;
    display: React.ReactNode;
}

const hf = new HfInference(process.env.HUGGINGFACEHUB_API_TOKEN);

function Loading() {
    return (
        <Skeleton className="flex flex-col gap-2 p-4 w-full h-10">
            <Skeleton className="w-1/4 h-3" />
            <Skeleton className="w-4/5 h-3" />
            <Skeleton className="w-1/2 h-3" />
            <Skeleton className="w-3/4 h-3" />
        </Skeleton>
    )
}

function EventSchedule({
  date,
  time,
  location,
}: {
  date: string;
  time: string;
  location: string;
}) {
  return (
    <div className="flex flex-col gap-2 bg-red-500">
      <h1 className="text-2xl font-semibold">Event Information</h1>
      <span>
        Date: {date} at {time}
      </span>
      <span>Location: {location}</span>
    </div>
  );
}

async function submitUserMessage(input: string) {
  "use server";
  const aiState = getMutableAIState();

  // Update the AI state with the new user message.
  aiState.update([
    //keeping previous messages
    ...aiState.get(),
    //adding new input
    {
      role: "user",
      content: input,
    },
  ]);

  const ui = render({
    model: "OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5",
    provider: hf.textGenerationStream,
    messages: [
      //prompt template
      {
        role: "system",
        content: "You are a helpful AI and make event schedules",
      },
      //previous and new message
      ...aiState.get(),
    ],
    // `text` is called when an AI returns a text response (as opposed to a tool call).
    // Its content is streamed from the LLM, so this function will be called
    // multiple times with `content` being incremental.
    text: ({ content, done }) => {
      // When it's the final content, mark the state as done and ready for the client to access.
      if (done) {
        aiState.done([
          ...aiState.get(),
          {
            role: "assistant",
            content,
          },
        ]);
      }

      return <p>{content}</p>;
    },
    tools: {
        get_event_info: {
            description: 'Get the information to schedule an event',
            parameters: z.object({
                date: z.string().describe('the event date'),
                time: z.string().describe('the event time'),
                location: z.string().describe('the event location'),
            }).required(),
            render: async function* (props) {
                yield <Loading />

                aiState.done([
                  ...aiState.get(),
                  {
                    role: "function",
                    name: "get_event_info",
                    content: JSON.stringify(props)
                  },
                ]);

                return <EventSchedule {...props} />
            }
        }
    }
  });
  
  return {
    id: Date.now(),
    display: ui
  };
}

const initialAIState: InitialAIStateProps[] = []
const initialUIState: InitialUIStateProps[] = []

export const AI = createAI({
    actions: {
        submitUserMessage
    },
    initialAIState,
    initialUIState
})