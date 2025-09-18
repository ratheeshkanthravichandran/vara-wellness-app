'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing a personalized wellness journal entry
 * based on the user's mood and a journal entry. It analyzes the sentiment of the entry and offers
 * supportive content.
 *
 * - `generateWellnessJournalEntry` - The exported function to trigger the flow.
 * - `WellnessJournalInput` - The input type for the flow.
 * - `WellnessJournalOutput` - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const WellnessJournalInputSchema = z.object({
  mood: z
    .string()
    .describe('The user’s current mood (e.g., happy, sad, anxious, calm).'),
  journalEntry: z
    .string()
    .describe('The user’s journal entry about their thoughts and feelings.'),
});

export type WellnessJournalInput = z.infer<typeof WellnessJournalInputSchema>;

const WellnessJournalOutputSchema = z.object({
  title: z.string().describe('A title for the generated wellness content.'),
  content: z
    .string()
    .describe(
      'A supportive and reflective piece of content based on the journal entry, such as a short story, a poem, or a motivational paragraph.'
    ),
  affirmation: z
    .string()
    .describe('A positive affirmation to uplift the user.'),
});

export type WellnessJournalOutput = z.infer<
  typeof WellnessJournalOutputSchema
>;

export async function generateWellnessJournalEntry(
  input: WellnessJournalInput
): Promise<WellnessJournalOutput> {
  return wellnessJournalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'wellnessJournalPrompt',
  input: { schema: WellnessJournalInputSchema },
  output: { schema: WellnessJournalOutputSchema },
  prompt: `You are a compassionate and insightful wellness assistant. Your goal is to provide a sense of comfort and reflection to the user based on their journal entry and mood.

Analyze the user's mood and journal entry to generate a unique and personalized piece of content. This could be a short, metaphorical story, a gentle poem, or a piece of reflective prose that mirrors their feelings in a supportive way.

User's Mood: {{{mood}}}
User's Journal Entry:
"{{{journalEntry}}}"

Based on this, generate:
1.  A creative and fitting **title**.
2.  A thoughtful and empathetic **content** piece (story, poem, or reflection).
3.  A simple and powerful **affirmation**.

Your response should be gentle, non-judgmental, and aim to make the user feel seen and understood.`,
});

const wellnessJournalFlow = ai.defineFlow(
  {
    name: 'wellnessJournalFlow',
    inputSchema: WellnessJournalInputSchema,
    outputSchema: WellnessJournalOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
