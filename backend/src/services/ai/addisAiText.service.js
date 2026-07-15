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
import logger from '../../utils/logger.js';

/**
 * Generate report text from a structured prompt.
 *
 * @param {string} prompt - The report generation prompt
 * @returns {Promise<{text: string, modelVersion: string, finishReason: string, inputTokens: number, outputTokens: number}>}
 * @throws {ApiError} On provider error (mapped via addisAi.client.js)
 */
export async function generateText(prompt) {
  const body = JSON.stringify({
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

  logger.info('Addis AI text generation raw response keys', {
    keys: Object.keys(result || {}),
    hasResponseText: 'response_text' in (result || {}),
    hasData: 'data' in (result || {}),
    hasResponse: 'response' in (result || {}),
    hasGeneratedText: 'generated_text' in (result || {}),
  });

  const text = result?.response_text || result?.data?.response_text ||
    result?.response || result?.data?.response ||
    result?.generated_text || result?.data?.generated_text || '';

  const usage = result?.usage_metadata || result?.data?.usage_metadata || {};

  return {
    text,
    modelVersion: result?.modelVersion || result?.data?.modelVersion || '',
    finishReason: result?.finish_reason || result?.data?.finish_reason || 'completed',
    inputTokens: usage?.prompt_token_count || usage?.inputTokens || 0,
    outputTokens: usage?.candidates_token_count || usage?.outputTokens || 0,
  };
}
