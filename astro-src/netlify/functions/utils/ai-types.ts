// ai-types.ts — Types for OpenRouter AI integration
// Located in netlify/functions/utils/ to stay within the esbuild boundary.
// Do NOT move to src/types/ — Netlify Functions cannot import from src/.

/**
 * Discriminated union representing the result of an AI analysis attempt.
 * - 'success': AI generated content successfully
 * - 'failed': AI was called but errored (timeout, network, validation)
 * - 'skipped': AI was intentionally not called (missing API key, daily cap)
 */
export type AiAnalysisResult =
  | { status: 'success'; content: string; model: string; tokensUsed: number; generatedAt: string }
  | { status: 'failed'; reason: string }
  | { status: 'skipped'; reason: string };

/**
 * Input parameters for AI analysis generation.
 * Contains ONLY technical data — NO PII (no email, phone, name).
 */
export interface AiAnalysisInput {
  capacityKw: number;
  panelYear: string; // '2008-2014' | '2015-2019' | '2020+'
  planExpansion: boolean;
  annualLossKc: number;
  pricingTier: { price: number | null; label: string };
}
