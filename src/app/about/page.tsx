export default function AboutPage() {
    return (
      <div>
        <h1>About the Chat</h1>
        <p>
          The main chat is an open-source chat using Hugging Face Inference API
          to get the Open Assistant model. It is very simple to implement a chat
          with Vercel&apos;s AI SDK, with any provider, TogetherAI, Anthropic,
          OpenAI, Hugging Face, LangChain and many others.
        </p>
        <p>
          However, it&apos;s not that simple to implement the function calling
          feature, it&apos;s available in a few LLMs and AI SDK only supports
          some of them. You have other ways to stream UI and text information
          using their other APIs.
        </p>
      </div>
    );
}