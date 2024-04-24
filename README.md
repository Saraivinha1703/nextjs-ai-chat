This project was done using only `Next.js` (back-end and front-end) - In this <i>"version"</i> <small>`(v0.3-lw)`</small> I'm using `Open AI Embeddings` model and `Open AI` as the provider, using `LangChain` to orchestrate all the data.

# back-end

Everything was done following the [Vercel  AI SDK documentation](https://sdk.vercel.ai/docs) and their Google Gemini Generative UI repository, that you can see [here](https://github.com/vercel-labs/gemini-chatbot).

to have access to the models you will need a Together AI API key:

```env
TOGETHER_AI_API_KEY=secret-key
```
for a simple RAG (Retrieval Augmented Generation) you will need a Pinecone API key:

```env
PINECONE_API_KEY=secret-key
```
for a RAG chat you will also need a twelvedata API key:

```env
TWELVEDATA_API_KEY=your-api-key
```
# Simple RAG with Semantic Search
Everything was done following [this video](https://www.youtube.com/watch?v=6_mfYPPcZ60&t=11s).

Semantic search is a type of search done by `embeddings`, which are vectors that contains many dimensions and numbers representing real-world objects, relationships and context. When an embedding is close to another one, it means they are similar and that is how the semantic search works, when the user asks a question it is converted to a embedding value which is searched in the vector store to get the top 10 or top 5 similar results.

The LLM have our vector store database, in this case [Pinecone](https://docs.pinecone.io/home) as a source to answer the user's questions. Here is the workflow, we setup a `documents` folder in our root folder, read all the files there, break each text content inside them into chunks, convert this chunks into embedding values, them make a query function to search for what you want. In this case I just put one file about dividends from [Trading212](https://www.trading212.com/learn/dividends). 

Here is how it works:

https://github.com/Saraivinha1703/nextjs-ai-chat/assets/62428073/2bdca75b-31e1-4aa9-bd9e-2c927540371b

The main functions are in the `app/lib/utils` folder, those functions are used to create, update and query into our vetor store in Pinecone, all the responses are based on the data from our `dividend.txt` file.


## RAG Chat
There are different ways to do a RAG chat, I decided to use the retrieval as a tool, since I wanted the AI to be a little more *human* with some generic messages like greeting and polity responses. I also wanted it to have tools with external access, being able to call APIs. Here is how it works:

It can talk about finance (limited by the documents in `documents/financial`) according to the informating it have in the vector store, doing a semantic search to choose the best answer:

https://github.com/Saraivinha1703/nextjs-ai-chat/assets/62428073/8c7bc277-0f5c-4399-bcea-21e007bc0023

It can retrieve possible stocks symbols according to the name of the company, you can also see the price for some stocks (the API returns an empty string in some of them, but this have a validation) and if you pass an invalid name of a company it also have a custom message, but those validations are made in the tool and not by the LLM: 

https://github.com/Saraivinha1703/nextjs-ai-chat/assets/62428073/6a0dc035-2195-4f5c-8052-9872b07c0e8f

It can also get stock prices if the user passes a stock symbol. It has some issue with the stock symbol if it has numbers, but it may be the prompt, which makes the LLM do a validation (will be fixed):

https://github.com/Saraivinha1703/nextjs-ai-chat/assets/62428073/c7261828-38ce-443b-a922-77cc0ab5993c

To develop this RAG is basically do a simple RAG QA and use it as a tool as I did before in the Generative UI, which use tools to call *external* APIs. You can see all the files that make it work in `src/lib/rag-chat` folder.
# front-end

I'm using `TailwindCSS` which comes by default with Next.js, `shadcn/ui`, to have base components ready and styled quickly and `next-themes` to provide themes to my application.

# Simple RAG with Semantic Search
In the front-end we just need to make buttons trigger the routes that executes our functions.
These are the functions that call our routes:

```ts
    async function createIndexAndEmbeddings() {
        try {
            const result = await fetch("/api/semantic-search/setup", {
              method: "GET",
            });

            const json = await result.json();
            console.log("result: ", json);
        } catch (e) {
            console.error("error: ", e)
        }
    }

    async function sendQuery() {
        if(!query) return;

        setResult("");
        setLoading(true);

        try {
          const result = await fetch("api/semantic-search/read", {
            method: "POST",
            body: JSON.stringify({query}),
          });

          const json = await result.json();
          setResult(json.data);
          setQuery("");
        } catch (e) {
            console.error("error: ", e);
        } finally {
            setLoading(false);
        }
    }
```


## RAG Chat

The front-end is pretty similar with the Generative UI chat, you can check out the `app/rag-chat/fragments/rag-chat.tsx` file, or the Generative UI documentation.

# Extra
Have fun chating with the **AI**, just be careful with what you wish for ☠️☠️

![image](https://github.com/Saraivinha1703/nextjs-ai-chat/assets/62428073/e4d29f63-95ba-42cb-94ad-b466c0240259)
