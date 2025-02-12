import { Request, Response } from 'express'
import { Ollama } from '@langchain/community/llms/ollama'

const ollama = new Ollama({
    model: 'mistral',
    baseUrl: 'http://localhost:11434',
    temperature: 0.3,
    stop: ['User:'],
});

const generatePrompt = (userPrompt: string): string => `
You are a helpful assistant that can answer questions and help with tasks.
User: ${userPrompt}
AI: 
`;

export const chatHandler = async (req: Request, res: Response) => {
    if (!req.body.prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        const formattedPrompt = generatePrompt(req.body.prompt);
        
        // ✅ `prompt` objesi yerine doğrudan `formattedPrompt` stringini kullan
        const stream = await ollama.stream(formattedPrompt);

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');

        for await (const chunk of stream) {
            res.write(chunk);
        }

        res.end();
    } catch (error) {
        console.error("Error in chatHandler:", error);
        res.status(500).json({ error: "An error occurred while processing the request." });
    }
};