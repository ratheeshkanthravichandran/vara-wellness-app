import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({tools: ['googleSearch']})],
  model: {
    name: 'googleai/gemini-2.5-flash',
  },
});
