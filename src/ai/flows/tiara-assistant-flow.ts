'use server';
/**
 * @fileOverview Defines a Genkit flow for a general-purpose AI assistant named Tiara.
 *
 * - `askTiara` - The exported function to trigger the non-streaming flow.
 * - `askTiaraStream` - The exported function to trigger the streaming flow.
 * - `TiaraInput` - The input type for the flow.
 * - `TiaraOutput` - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const TiaraInputSchema = z.object({
  history: z.array(MessageSchema).optional(),
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

export async function askTiaraStream(
  input: TiaraInput
): Promise<ReadableStream<Uint8Array>> {
  const { stream } = tiaraAssistantStreamFlow(input);

  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk) {
          controller.enqueue(encoder.encode(chunk));
        }
      }
      controller.close();
    },
  });

  return readableStream;
}

const prompt = ai.definePrompt({
  name: 'tiaraAssistantPrompt',
  input: { schema: TiaraInputSchema },
  tools: ['googleSearch'],
  prompt: `You are Tiara, a compassionate, helpful, and friendly AI assistant integrated into the Vara wellness app.

Your role is to engage in open conversation with the user on any topic they wish to discuss. Provide supportive, informative, and thoughtful responses.

If you don't know the answer to a question, use the provided Google Search tool to find the most up-to-date and relevant information.

{{#if history}}
Conversation History:
{{#each history}}
- {{role}}: {{content}}
{{/each}}
{{/if}}

Current User's message:
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
    const response = result.text;
    return { response };
  }
);

const tiaraAssistantStreamFlow = ai.defineFlow(
  {
    name: 'tiaraAssistantStreamFlow',
    inputSchema: TiaraInputSchema,
    stream: true,
  },
  async (input) => {
    const { stream } = await prompt(input);
    return stream.pipe(chunk => chunk.text);
  }
);
