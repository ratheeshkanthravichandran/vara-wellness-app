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

export function askTiaraStream(
  input: TiaraInput
): ReadableStream<string> {
  const { stream } = tiaraAssistantStreamFlow(input);
  return stream.pipeThrough(
    new TransformStream({
      transform: (chunk, controller) => {
        controller.enqueue(chunk.text);
      },
    })
  );
}


const prompt = ai.definePrompt({
  name: 'tiaraAssistantPrompt',
  input: { schema: TiaraInputSchema },
  prompt: `You are Tiara, a compassionate, helpful, and friendly AI assistant integrated into the Vara wellness app.

Your primary role is to engage in open conversation with the user on any topic they wish to discuss. Provide supportive, informative, and thoughtful responses.

You have access to real-time information from the internet through a search tool. You should use this tool whenever a user asks a question that you cannot answer from your internal knowledge, especially for recent events or specific people.

When using the search tool, you do not need to mention that you are searching. Simply provide the answer to the user as if you knew it.

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
    return { response: result.text };
  }
);

const tiaraAssistantStreamFlow = ai.defineFlow(
  {
    name: 'tiaraAssistantStreamFlow',
    inputSchema: TiaraInputSchema,
    stream: true,
  },
  async (input) => {
    return await prompt(input);
  }
);
