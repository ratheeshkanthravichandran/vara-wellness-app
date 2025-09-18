'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing recipe suggestions
 * based on the user's menstrual cycle phase.
 *
 * - `getRecipeSuggestions` - The exported function to trigger the flow.
 * - `RecipeSuggestionsInput` - The input type for the flow.
 * - `RecipeSuggestionsOutput` - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const RecipeSuggestionsInputSchema = z.object({
  cyclePhase: z
    .string()
    .describe('The current phase of the menstrual cycle (e.g., menstruation, follicular, ovulation, luteal).'),
});

export type RecipeSuggestionsInput = z.infer<
  typeof RecipeSuggestionsInputSchema
>;

const RecipeSuggestionSchema = z.object({
  title: z.string().describe('The title of the recipe.'),
  description: z.string().describe('A short description of the recipe and why it is beneficial for the selected cycle phase.'),
  imageHint: z.string().describe('A two-word hint for generating a placeholder image for the recipe. e.g., "healthy salad"'),
});

const RecipeSuggestionsOutputSchema = z.object({
  recipes: z
    .array(RecipeSuggestionSchema)
    .describe('A list of 3 recipe suggestions tailored to the user\'s cycle phase.'),
});

export type RecipeSuggestionsOutput = z.infer<
  typeof RecipeSuggestionsOutputSchema
>;

export async function getRecipeSuggestions(
  input: RecipeSuggestionsInput
): Promise<RecipeSuggestionsOutput> {
  return recipeSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recipeSuggestionsPrompt',
  input: { schema: RecipeSuggestionsInputSchema },
  output: { schema: RecipeSuggestionsOutputSchema },
  prompt: `You are a nutritionist who specializes in hormonal health and cycle-syncing diets.

Generate 3 unique recipe suggestions tailored to the user's specified menstrual cycle phase.

For each recipe, provide a title, a short description explaining its benefits for that phase, and a two-word image hint for a placeholder.

- **Menstruation:** Focus on iron-rich, comforting, and anti-inflammatory foods. (e.g., lentil soup, salmon with roasted vegetables).
- **Follicular:** Focus on light, vibrant, and estrogen-supporting foods. (e.g., quinoa salads, lean proteins, fermented foods).
- **Ovulation:** Focus on high-fiber, antioxidant-rich foods to support liver function. (e.g., colorful salads, smoothies with berries, cruciferous vegetables).
- **Luteal:** Focus on foods that curb cravings and stabilize blood sugar, rich in B-vitamins and magnesium. (e.g., roasted sweet potatoes, dark chocolate, complex carbs).

Cycle Phase: {{{cyclePhase}}}
`,
});

const recipeSuggestionsFlow = ai.defineFlow(
  {
    name: 'recipeSuggestionsFlow',
    inputSchema: RecipeSuggestionsInputSchema,
    outputSchema: RecipeSuggestionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
