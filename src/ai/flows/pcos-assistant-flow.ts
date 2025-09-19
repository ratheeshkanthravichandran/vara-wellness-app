'use server';
/**
 * @fileOverview Defines a Genkit flow for an AI assistant specializing in PCOS/PCOD.
 *
 * - `askPcosAssistant` - The exported function to trigger the flow.
 * - `PcosAssistantInput` - The input type for the flow.
 * - `PcosAssistantOutput` - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const PcosAssistantInputSchema = z.object({
  history: z.array(MessageSchema).optional(),
  message: z.string().describe("The user's message or question about PCOS/PCOD."),
});
export type PcosAssistantInput = z.infer<typeof PcosAssistantInputSchema>;

const PcosAssistantOutputSchema = z.object({
  response: z.string().describe("The assistant's generated response."),
});
export type PcosAssistantOutput = z.infer<typeof PcosAssistantOutputSchema>;

export async function askPcosAssistant(input: PcosAssistantInput): Promise<PcosAssistantOutput> {
  return pcosAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pcosAssistantPrompt',
  input: { schema: PcosAssistantInputSchema },
  output: { schema: PcosAssistantOutputSchema },
  prompt: `You are an expert, compassionate, and knowledgeable AI assistant specializing in Polycystic Ovary Syndrome (PCOS) and Polycystic Ovary Disease (PCOD). Your name is Tiara.

Your primary role is to provide supportive, informative, and evidence-based information to users asking questions about PCOS/PCOD. You can discuss symptoms, lifestyle management (diet, exercise), emotional well-being, and general information about the conditions.

**IMPORTANT: You are not a medical professional. Always include a disclaimer in your first response of any conversation reminding the user that your advice is for informational purposes only and that they should consult with a qualified healthcare provider for diagnosis and treatment.**

When asked about treatment, focus on lifestyle modifications and supportive measures, and strongly advise consulting a doctor for medical treatment options like medication.

Maintain a friendly, empathetic, and encouraging tone. Your responses should be structured in a clear, point-by-point format using markdown for lists where appropriate.

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

const pcosAssistantFlow = ai.defineFlow(
  {
    name: 'pcosAssistantFlow',
    inputSchema: PcosAssistantInputSchema,
    outputSchema: PcosAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
