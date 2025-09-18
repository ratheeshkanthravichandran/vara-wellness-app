'use server';
/**
 * @fileOverview Defines a Genkit flow for a general-purpose AI assistant named Tiara.
 *
 * - `askTiara` - The exported function to trigger the flow.
 * - `askTiaraStream` - The exported function to trigger the streaming flow.
 * - `TiaraInput` - The input type for the flow.
 * - `TiaraOutput` - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai';

const TiaraInputSchema = z.object({
  message: z.string().describe("The user's message or question to Tiara."),
});
export type TiaraInput = z.infer<typeof TiaraInputSchema>;

const TiaraOutputSchema = z.object({
  response: z.string().describe("Tiara's generated response."),
});
export type TiaraOutput = z.infer<typeof TiaraOutputSchema>;

export async function askTiara(input: TiaraInput): Promise<TiaraOutput> {
  return tiaraAssistantFlow(input);
}

export async function askTiaraStream(input: TiaraInput) {
  const { stream } = await tiaraAssistantStreamFlow(input);
  const encoder = new TextEncoder();

  const newStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.content) {
          const text = chunk.content.map((c) => c.text || '').join('');
          controller.enqueue(encoder.encode(text));
        }
      }
      controller.close();
    },
  });

  return newStream;
}

const prompt = ai.definePrompt({
  name: 'tiaraAssistantPrompt',
  input: { schema: TiaraInputSchema },
  tools: [googleAI.googleSearch],
  prompt: `You are Tiara, a compassionate, helpful, and friendly AI assistant integrated into the Vara wellness app.

Your role is to engage in open conversation with the user on any topic they wish to discuss. Provide supportive, informative, and thoughtful responses.

If you need to access real-time information, use the provided web search tool.

User's message:
"{{{message}}}"

Your response:
`,
});

const tiaraAssistantFlow = ai.defineFlow(
  {
    name: 'tiaraAssistantFlow',
    inputSchema: TiaraInputSchema,
    outputSchema: TiaraOutputSchema,
  },
  async (input) => {
    const result = await prompt(input);
    return { response: result.text! };
  }
);

const tiaraAssistantStreamFlow = ai.defineFlow(
  {
    name: 'tiaraAssistantStreamFlow',
    inputSchema: TiaraInputSchema,
    stream: true,
  },
  async (input) => {
    return await prompt.stream(input);
  }
);
