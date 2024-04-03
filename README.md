This project was done using only `Next.js` (back-end and front-end), try it out [here](https://carlos-neto-nextjs-ai-chat.vercel.app/).

# back-end
Everything was done following the [Vercel  AI SDK documentation](https://sdk.vercel.ai/docs).
I'm also using TypeScript for a stronger typing. The model used is the one that Vercel uses in its documentation the `OpenAssistant` model,
which is open-source. 

I'm accessing this model through `Hugging Face` which now is basically a GitHub for AI models. 
You just need to create an API key in your Hugging Face account and add to your environment variables like this:

```env
HUGGINGFACE_API_TOKEN="hf_secret-key"
```

# front-end
I'm using `TailwindCSS` which comes by default with Next.js, `shadcn/ui`, to have base components ready and styled quickly and `next-themes` to provide themes to my application.

# Extra
Have fun chating with the **AI**, just be careful with what you wish for ☠️☠️

![image](https://github.com/Saraivinha1703/nextjs-ai-chat/assets/62428073/e4d29f63-95ba-42cb-94ad-b466c0240259)
