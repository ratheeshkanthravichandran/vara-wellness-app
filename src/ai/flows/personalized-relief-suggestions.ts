'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized relief suggestions
 * based on user-reported period symptoms, cycle phase, and flow intensity.
 *
 * The flow takes symptom details as input and returns tailored suggestions for relief.
 * - `getPersonalizedReliefSuggestions` - The exported function to trigger the flow.
 * - `PersonalizedReliefSuggestionsInput` - The input type for the flow.
 * - `PersonalizedReliefSuggestionsOutput` - The output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedReliefSuggestionsInputSchema = z.object({
  symptoms: z
    .array(z.string())
    .describe('A list of symptoms the user is experiencing (e.g., cramps, mood swings, headaches).'),
  cyclePhase: z
    .string()
    .describe(
      'The current phase of the menstrual cycle (e.g., menstruation, follicular phase, ovulation, luteal phase).' 
    ),
  flowIntensity: z
    .string()
    .describe('The intensity of menstrual flow (e.g., light, medium, heavy).'),
  lifestyleHabits: z
    .string()
    .optional()
    .describe('Optional details about the user lifestyle habits (e.g., exercise, diet, sleep).'),
});

export type PersonalizedReliefSuggestionsInput = z.infer<
  typeof PersonalizedReliefSuggestionsInputSchema
>;

const PersonalizedReliefSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe(
      'A list of personalized suggestions for relieving period symptoms, tailored to the user input.'
    ),
});

export type PersonalizedReliefSuggestionsOutput = z.infer<
  typeof PersonalizedReliefSuggestionsOutputSchema
>;

export async function getPersonalizedReliefSuggestions(
  input: PersonalizedReliefSuggestionsInput
): Promise<PersonalizedReliefSuggestionsOutput> {
  return personalizedReliefSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedReliefSuggestionsPrompt',
  input: {
    schema: PersonalizedReliefSuggestionsInputSchema,
  },
  output: {
    schema: PersonalizedReliefSuggestionsOutputSchema,
  },
  prompt: `You are a helpful assistant that provides personalized suggestions for relieving period symptoms.

  Based on the user's reported symptoms, cycle phase, flow intensity, and lifestyle habits, provide a list of tailored suggestions.

  Symptoms: {{symptoms}}
  Cycle Phase: {{cyclePhase}}
  Flow Intensity: {{flowIntensity}}
  Lifestyle Habits: {{lifestyleHabits}}

  Suggestions:`,
});

const personalizedReliefSuggestionsFlow = ai.defineFlow(
  {
    name: 'personalizedReliefSuggestionsFlow',
    inputSchema: PersonalizedReliefSuggestionsInputSchema,
    outputSchema: PersonalizedReliefSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
