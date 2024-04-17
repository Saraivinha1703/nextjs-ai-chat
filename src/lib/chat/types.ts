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
}[];

export type Actions = {
  submitUserMessage: (content: string) => Promise<{
    id: string;
    display: JSX.Element;
  }>;
};
