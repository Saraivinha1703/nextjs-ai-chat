export default function AboutPage() {
    return (
      <div className="flex justify-center p-4 w-full">
        <div className="flex flex-col gap-2 w-full sm:w-4/5 lg:w-3/4">
          <h1 className="text-3xl font-bold">About the Chats</h1>
          <p>
            The main chat is an open-source chat using Hugging Face Inference
            API to get the Open Assistant model. It is very simple to implement
            a chat with Vercel&apos;s AI SDK, with any provider, TogetherAI,
            Anthropic, OpenAI, Hugging Face, LangChain and many others.
          </p>
          <p>
            However, it&apos;s not that simple to implement the tool calling
            feature, it&apos;s available in a few LLMs. The AI SDK have the
            render function, which currently the only supported provider is
            OpenAI (04/2024), however they also made other functions to develop
            a Generative UI using other LLMs 🥳.
          </p>
          <p>
            In this project I used Together AI as a model provider, because it
            was the best option when it comes to cost and benefit. You just pay
            for what you use and when you start they give $25.00 (dolars) to
            test it and they have a lot of options to choose from.
          </p>
          <p>
            I&apos;ve choosen Mistral&apos;s model
            &apos;mistralai/Mixtral-8x7B-Instruct-v0.1&apos; it is more expansive than other LLMs,
            but Together AI currently have only three models that support tool calling and this is one of them.
          </p>
          <p>
            the Generative UI is just the process of render a component using the tool calling feature from the LLM.
            It is a powerful feature, you can access real-time information about anything that you want and also have a vector store retrieval
            as a tool, using the technique called RAG - Retrieval Augmented Generation, which is just the process of getting information
            from some source and insert into the model, with all of that you have a very powerful assistant.
          </p>
        </div>
      </div>
    );
}