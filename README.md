This project was done using only `Next.js` (back-end and front-end) - In this <i>"version"</i> <small>`(v0.3-lw)`</small> I'm using `Open AI Embeddings` model and `Open AI` as the provider, using `LangChain` to orchestrate all the data.

# back-end

Everything was done following [this video](https://www.youtube.com/watch?v=6_mfYPPcZ60&t=11s).
I'm also using TypeScript for a stronger typing.

# Semantic Search

Semantic search is a type of search done by `embeddings`, which are vectors that contains many dimensions and numbers representing real-world objects, relationships and context. When an embedding is close to another one, it means they are similar and that is how the semantic search works, when the user asks a question it is converted to a embedding value which is searched in the vector store to get the top 10 or top 5 similar results.

The LLM have our vector store database, in this case [Pinecone](https://docs.pinecone.io/home) as a source to answer the user's questions. Here is the workflow, we setup a `documents` folder in our root folder, read all the files there, break each text content inside them into chunks, convert this chunks into embedding values, them make a query function to search for what you want. In this case I just put one file about dividends from [Trading212](https://www.trading212.com/learn/dividends). 

Here is how it works:

https://github.com/Saraivinha1703/nextjs-ai-chat/assets/62428073/2bdca75b-31e1-4aa9-bd9e-2c927540371b

The main functions are in the `app/lib/utils` folder, those functions are used to create, update and query into our vetor store in Pinecone, all the responses are based on the data from our `dividend.txt` file.

Goals:
- Stream the response.
- Build a chat instead of just a Q&A conversation with tools and keeping the context of the conversation.
- Use other LLM instead of OpenAI models.

Future goals:
- Make an authentication system to store the chat for each user.

# front-end

I'm using `TailwindCSS` which comes by default with Next.js, `shadcn/ui`, to have base components ready and styled quickly and `next-themes` to provide themes to my application.

# Semantic Search
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

# Extra
Have fun chating with the **AI**, just be careful with what you wish for ☠️☠️

![image](https://github.com/Saraivinha1703/nextjs-ai-chat/assets/62428073/e4d29f63-95ba-42cb-94ad-b466c0240259)
