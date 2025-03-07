import { searchposts } from '@/actions/agent.actions';
import { GoogleGenerativeAI } from '@google/generative-ai';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const askGemini = async function* (query: string) {
  try {

    if (!query || typeof query !== 'string') {
      yield 'Please provide a valid query.';
      return;
    }

    const postsData = await searchposts(query);

    const prompt = `
      I’m providing data from my blog posts below:\n
      ${JSON.stringify(postsData, null, 2)}\n\n
      Using this data, analyze and respond to the following user query: "${query}". 
      Provide a clear, concise, and relevant answer based solely on the blog post data unless the query explicitly asks for external information. 
      If the data is insufficient to answer the query, state that and suggest what additional information might be needed. 
      If no relevant data is found, share general knowledge about the topic and avoid fabricating details. You are created by AstraX and this website is a blog website with blogs related to changing trends in tech.The purpose of this site is to aware people with tech and name of this website is Astra Blog.
    `;


    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      yield chunkText;
    }
  } catch (error) {
    console.error('Error in askGemini stream:', error);
    yield 'Sorry, an error occurred while processing your request. Please try again later.';
  }
};