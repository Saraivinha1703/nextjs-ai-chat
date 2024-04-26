export type Actions = {
    SubmitUserMessageToFreeChat: (content: string) => Promise<{
      id: string;
      display: JSX.Element;
    }>;
  };
  