'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing tailored activity recommendations based on the user's current cycle phase and energy levels.
 *
 * - tailoredActivityRecommendations - A function that takes the user's cycle phase, energy levels and symptom descriptions and provides activity recommendations.
 * - TailoredActivityRecommendationsInput - The input type for the tailoredActivityRecommendations function.
 * - TailoredActivityRecommendationsOutput - The return type for the tailoredActivityRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TailoredActivityRecommendationsInputSchema = z.object({
  cyclePhase: z
    .string()
    .describe("The user's current cycle phase (e.g., menstruation, follicular phase, ovulation, luteal phase)."),
  energyLevels: z
    .string()
    .describe("The user's current energy levels (e.g., low, medium, high)."),
  symptomDescription: z
    .string()
    .describe("A description of the user's symptoms, if any."),
});
export type TailoredActivityRecommendationsInput = z.infer<typeof TailoredActivityRecommendationsInputSchema>;

const TailoredActivityRecommendationsOutputSchema = z.object({
  activityRecommendations: z
    .string()
    .describe('Tailored activity recommendations based on the user input.'),
});
export type TailoredActivityRecommendationsOutput = z.infer<
  typeof TailoredActivityRecommendationsOutputSchema
>;

export async function tailoredActivityRecommendations(
  input: TailoredActivityRecommendationsInput
): Promise<TailoredActivityRecommendationsOutput> {
  return tailoredActivityRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tailoredActivityRecommendationsPrompt',
  input: {schema: TailoredActivityRecommendationsInputSchema},
  output: {schema: TailoredActivityRecommendationsOutputSchema},
  prompt: `You are a personal wellness assistant specializing in recommending activities and exercises tailored to women's menstrual cycles.

  Based on the user's current cycle phase, energy levels, and any reported symptoms, provide a list of suitable activities and exercises.  Consider the following when crafting your recommendations:

  - **Menstruation:**  Recommend gentle activities like walking, yoga, or stretching.  Emphasize rest and self-care.
  - **Follicular Phase:** Suggest moderate-intensity workouts like jogging, swimming, or dancing.  Encourage trying new activities.
  - **Ovulation:**  Recommend high-energy activities like HIIT, running, or group fitness classes.
  - **Luteal Phase:** Suggest activities like Pilates, light weightlifting, or nature walks. Be mindful of potential PMS symptoms and adjust intensity accordingly.

  Take into account the user's energy levels and symptom description when making the recommendations.

  Cycle Phase: {{{cyclePhase}}}
  Energy Levels: {{{energyLevels}}}
  Symptoms: {{{symptomDescription}}}

  Activity Recommendations:`,
});

const tailoredActivityRecommendationsFlow = ai.defineFlow(
  {
    name: 'tailoredActivityRecommendationsFlow',
    inputSchema: TailoredActivityRecommendationsInputSchema,
    outputSchema: TailoredActivityRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
