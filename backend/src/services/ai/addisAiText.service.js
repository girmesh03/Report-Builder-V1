/**
 * Addis AI text generation service.
 *
 * Sends a structured prompt to Addis AI chat generation endpoint
 * and returns the generated report text with metadata.
 *
 * @module services/ai/addisAiText
 */
import env from '../../config/env.js';
import { post } from './addisAi.client.js';

/**
 * Generate report text from a structured prompt.
 *
 * @param {string} prompt - The report generation prompt
 * @returns {Promise<{text: string, modelVersion: string, finishReason: string, inputTokens: number, outputTokens: number}>}
 * @throws {ApiError} On provider error (mapped via addisAi.client.js)
 */
export async function generateText(prompt) {
  const body = JSON.stringify({
    model: env.ADDIS_AI_TEXT_MODEL,
    prompt,
    target_language: env.ADDIS_AI_DEFAULT_TARGET_LANGUAGE,
    generation_config: {
      temperature: 0.2,
      maxOutputTokens: 4096,
      topP: 0.9,
      topK: 40,
    },
  });

  const result = await post('/api/v1/chat_generate', body, 'application/json');

  const data = result?.data || {};
  const usage = data?.usage_metadata || {};

  return {
    text: data?.response || data?.generated_text || '',
    modelVersion: data?.model || env.ADDIS_AI_TEXT_MODEL || '',
    finishReason: data?.finish_reason || 'completed',
    inputTokens: usage?.inputTokens || 0,
    outputTokens: usage?.outputTokens || 0,
  };
}
