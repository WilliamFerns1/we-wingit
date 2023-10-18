import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const conversationStr = req.body.conversation;

    try {
      const response = await openai.createCompletion({
        model: 'gpt-3.5-turbo-instruct',
        prompt: conversationStr,
        presence_penalty: 0,
        frequency_penalty: 0.3,
        max_tokens: 100,
        temperature: 0,
        stop: ['\n', '->'],
      });

      res.status(200).json({ response });
    } catch (error) {
      res.status(500).json({ error: 'Error calling OpenAI API' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
