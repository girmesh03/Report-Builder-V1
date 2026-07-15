/**
 * Addis AI transcription review service.
 *
 * Sends raw transcription text to Addis AI for review/correction
 * to improve accuracy of Amharic speech-to-text output.
 * Returns the corrected transcription as plain Amharic text.
 *
 * @module services/ai/addisAiTranscriptionReview
 */
import env from '../../config/env.js';
import { post } from './addisAi.client.js';
import logger from '../../utils/logger.js';

/**
 * Check if transcription text appears to be empty, silent, or noise-only.
 *
 * @param {string} text - Raw transcription text
 * @returns {boolean}
 */
function isEmptyTranscription(text) {
  if (!text || typeof text !== 'string') return true;
  const cleaned = text.replace(/[\s.,!?;:-]+/g, '').trim();
  return cleaned.length < 3;
}

/**
 * Build a plain-text prompt for transcription review in Amharic.
 *
 * Tells the AI to fix transcription errors and return only the
 * corrected Amharic text without explanation or JSON formatting.
 *
 * @param {string} transcription - Raw transcription text
 * @param {string} [feedback] - Optional user feedback for iterative improvement
 * @returns {string} Plain text prompt
 */
function buildReviewPrompt(transcription, feedback) {
  const parts = [
    `You are correcting an Amharic speech-to-text transcription.`,
    ``,
    `The text below is raw output from an automatic speech recognition system.`,
    `It contains errors: misheard words, incorrect word boundaries, missing punctuation, and garbled phrases.`,
    ``,
    `Your task is to fix these errors and return ONLY the corrected Amharic text.`,
    `- Fix misheard words and fill in gaps where the meaning is clear`,
    `- Correct word boundaries and spelling`,
    `- Add proper Amharic punctuation`,
    `- Preserve the speaker's intended meaning — do NOT add, remove, or change factual content`,
    `- Keep the same length and structure as the original`,
    `- Keep English technical terms as they are (e.g. ኪችን, ቼክሊስት, ኢንተርኔት)`,
    `- If parts are unclear or impossible to correct confidently, leave them unchanged`,
    `- If the text is empty, contains only silence/noise, or is too short for meaningful speech, return only the word: ባዶ`,
    ``,
    `Return ONLY the corrected Amharic text.`,
    `Do NOT include explanations, notes, JSON, markdown, or any formatting.`,
    `Do NOT translate to English.`,
    `Return pure Amharic text only.`,
  ];

  if (feedback) {
    parts.push(``);
    parts.push(`The user has provided the following feedback for re-review:`);
    parts.push(feedback);
    parts.push(``);
    parts.push(`Apply this feedback and return the improved Amharic text only.`);
  }

  parts.push(``);
  parts.push(`---`);
  parts.push(transcription);

  return parts.join('\n');
}

/**
 * Send transcription to Addis AI for review/correction.
 *
 * @param {string} transcription - Raw transcription text
 * @param {string} [feedback] - Optional user feedback for re-review
 * @returns {Promise<{reviewedText: string, changes: string}>}
 * @throws {ApiError} On provider error
 */
export async function reviewTranscription(transcription, feedback) {
  if (isEmptyTranscription(transcription)) {
    logger.info('Skipping AI transcription review — empty/silent transcription');
    return { reviewedText: '', changes: 'No speech detected in the recording.' };
  }

  const prompt = buildReviewPrompt(transcription, feedback);

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

  logger.info('Addis AI transcription review raw response keys', {
    keys: Object.keys(result || {}),
  });

  const rawText = result?.response_text || result?.data?.response_text ||
    result?.response || result?.data?.response ||
    result?.generated_text || result?.data?.generated_text || '';

  const reviewedText = rawText.trim();

  // Detect empty/silent indicator
  if (reviewedText === 'ባዶ' || reviewedText === '') {
    return { reviewedText: '', changes: 'No speech detected in the recording.' };
  }

  // Hallucination guard: if input is short and output is disproportionately large, reject
  const inputLen = (transcription || '').trim().length;
  const outputLen = reviewedText.length;
  if (inputLen < 10 && outputLen > inputLen * 5) {
    logger.warn('AI hallucination detected: output disproportionately large for short input', { inputLen, outputLen });
    return { reviewedText: '', changes: 'No speech detected in the recording.' };
  }

  return { reviewedText, changes: 'ተስተካክሏል' };
}
