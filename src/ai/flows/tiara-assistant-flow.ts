'use server';
/**
 * @fileOverview Defines a Genkit flow for a general-purpose AI assistant named Tiara.
 *
 * - `askTiara` - The exported function to trigger the flow.
 * - `TiaraInput` - The input type for the flow.
 * - `TiaraOutput` - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

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

const prompt = ai.definePrompt({
  name: 'tiaraAssistantPrompt',
  input: { schema: TiaraInputSchema },
  prompt: `You are Tiara, a compassionate, helpful, and friendly AI assistant integrated into the Vara wellness app.

Your role is to engage in open conversation with the user on any topic they wish to discuss. Provide supportive, informative, and thoughtful responses.

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
    const response = result.text;
    return { response };
  }
);
