/**
 * Audio chunking utility — always convert then split.
 *
 * Strategy (avoids per-segment re-encoding artifacts):
 *   1. Use ffmpeg to convert the ENTIRE file to WAV in a single pass
 *      (16-bit PCM, 16kHz, mono — optimal for Addis AI STT).
 *   2. Use the pure-JS WAV splitter to divide the decoded PCM
 *      into fixed-duration chunks at exact byte boundaries.
 *
 * Always converts to WAV first, even for files under the chunk duration,
 * because the STT API works best with clean 16kHz PCM mono input rather
 * than the browser's lossy compressed formats (Opus/AAC).
 *
 * ffmpeg must be installed and on PATH or at FFMPEG_PATH / FFPROBE_PATH.
 *
 * @module services/ai/audioChunker
 */
import { execFile } from 'child_process';
import { readFile, unlink } from 'fs/promises';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import { STT_CHUNK_DURATION_SECONDS } from '../../utils/fileValidation.js';
import { splitWavPcm } from './wavSplitter.js';
import env from '../../config/env.js';

/**
 * @typedef {object} AudioChunk
 * @property {Buffer} buffer - Complete self-contained WAV chunk buffer
 * @property {number} index - Chunk index (0-based)
 */

/**
 * Convert audio to WAV then split into chunks.
 *
 * Every file is first converted to 16-bit PCM 16kHz mono WAV via ffmpeg
 * before being split. This guarantees consistent input quality to the STT API.
 *
 * @param {string} filePath - Path to the audio file on disk
 * @param {number} [maxDuration=STT_CHUNK_DURATION_SECONDS] - Max seconds per chunk
 * @param {number} [overlapSeconds=2] - Seconds of overlap between adjacent chunks
 * @returns {Promise<AudioChunk[]>}
 */
export async function chunkAudio(filePath, maxDuration = STT_CHUNK_DURATION_SECONDS, overlapSeconds = 2) {
  const wavPath = await convertToWav(filePath);
  let wavBuffer;
  try {
    wavBuffer = await readFile(wavPath);
  } finally {
    await unlink(wavPath).catch(() => {});
  }

  return splitWavPcm(wavBuffer, maxDuration, overlapSeconds);
}

/**
 * Convert an audio file to WAV (16-bit PCM, 16kHz, mono) in a single pass.
 *
 * @param {string} inputPath - Path to source audio file
 * @returns {Promise<string>} Path to the converted WAV file
 * @throws {Error} If ffmpeg conversion fails
 */
function convertToWav(inputPath) {
  const outputPath = path.join(os.tmpdir(), `converted-${crypto.randomUUID()}.wav`);

  return new Promise((resolve, reject) => {
    execFile(env.FFMPEG_PATH, [
      '-i', inputPath,
      '-acodec', 'pcm_s16le',
      '-ar', '16000',
      '-ac', '1',
      '-y',
      outputPath,
    ], { timeout: 300000 }, (err) => {
      if (err) {
        reject(new Error(`ffmpeg conversion failed: ${err.message}`));
        return;
      }
      resolve(outputPath);
    });
  });
}
