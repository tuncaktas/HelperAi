import { Request, Response } from 'express'
import { Ollama } from '@langchain/community/llms/ollama'

const ollama = new Ollama({
    baseUrl: "http://localhost:11434",
    model: "llama3.2:latest",
    temperature: 0.3,
    stop: ['User:']
})

export const chatHandler = async (req: Request, res: Response) => {
    const prompt = (prompt: string) => `You are a helpful assistant that can answer questions and help with tasks.
    User: ${prompt}
    AI:`;

    const stream = await ollama.stream(prompt(req.body.prompt));

    try {
        for await (const chunk of stream) {
            console.log(chunk)
            res.write(`data: ${JSON.stringify({ message: chunk, event: 'TYPING' })}\n\n`);
        }
        res.write(`data: ${JSON.stringify({ event: 'DONE' })}\n\n`);
    } catch (e) {
        res.write(`data: ${JSON.stringify({ event: 'DONE' })}\n\n`);
    } finally {
        res.write(`data: ${JSON.stringify({ event: 'DONE' })}\n\n`);
        res.end();
    }
};