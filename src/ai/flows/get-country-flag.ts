
'use server';
/**
 * @fileOverview A country flag generating AI agent.
 *
 * - getCountryFlag - A function that handles the flag generation process.
 * - CountryFlagInput - The input type for the getCountryFlag function.
 * - CountryFlagOutput - The return type for the getCountry-flag function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CountryFlagInputSchema = z.object({
  country: z.string().describe('The name of the country.'),
});
export type CountryFlagInput = z.infer<typeof CountryFlagInputSchema>;

const CountryFlagOutputSchema = z.object({
  flagDataUri: z
    .string()
    .describe(
      "An image of the country's flag, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type CountryFlagOutput = z.infer<typeof CountryFlagOutputSchema>;

export async function getCountryFlag(
  input: CountryFlagInput
): Promise<CountryFlagOutput> {
  return getCountryFlagFlow(input);
}

const getCountryFlagFlow = ai.defineFlow(
  {
    name: 'getCountryFlagFlow',
    inputSchema: CountryFlagInputSchema,
    outputSchema: CountryFlagOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `a flag of ${input.country}`,
    });
    return {flagDataUri: media.url!};
  }
);
