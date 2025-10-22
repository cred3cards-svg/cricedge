
'use server';
/**
 * @fileOverview A sports-match analysis AI agent.
 *
 * - getMatchAnalysis - A function that handles the match analysis process.
 * - MatchAnalysisInput - The input type for the getMatchAnalysis function.
 * - MatchAnalysisOutput - The return type for the getMatch-analysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MatchAnalysisInputSchema = z.object({
  teamA: z.string().describe('The name of team A.'),
  teamB: z.string().describe('The name of team B.'),
});
export type MatchAnalysisInput = z.infer<typeof MatchAnalysisInputSchema>;

const MatchAnalysisOutputSchema = z.object({
  analysis: z
    .string()
    .describe(
      'A detailed analysis of the upcoming match between the two teams.'
    ),
  predictedWinner: z
    .string()
    .describe('The name of the team that is predicted to win.'),
  confidence: z
    .number()
    .describe(
      'A confidence score (from 0 to 1) in the prediction of the winner.'
    ),
});
export type MatchAnalysisOutput = z.infer<typeof MatchAnalysisOutputSchema>;

export async function getMatchAnalysis(
  input: MatchAnalysisInput
): Promise<MatchAnalysisOutput> {
  return getMatchAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getMatchAnalysisPrompt',
  input: {schema: MatchAnalysisInputSchema},
  output: {schema: MatchAnalysisOutputSchema},
  prompt: `You are an expert sports analyst. Analyze the upcoming match between {{{teamA}}} and {{{teamB}}}. Provide a detailed analysis of the match, predict a winner, and provide a confidence score for your prediction.`,
});

const getMatchAnalysisFlow = ai.defineFlow(
  {
    name: 'getMatchAnalysisFlow',
    inputSchema: MatchAnalysisInputSchema,
    outputSchema: MatchAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    