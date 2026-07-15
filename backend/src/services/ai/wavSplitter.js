/**
 * WAV audio splitter — pure-JS PCM-level splitting with overlap support.
 *
 * Splits a decoded WAV buffer (PCM format, any sample rate/channels)
 * into fixed-duration chunks at exact byte boundaries. Adjacent chunks
 * can overlap by a configurable duration to avoid losing context at
 * boundaries. No re-encoding needed — each chunk gets a valid RIFF/WAVE
 * header.
 *
 * @module services/ai/wavSplitter
 */

const PCM_FORMAT = 1;

/**
 * @typedef {object} WavChunk
 * @property {Buffer} buffer - Complete self-contained WAV buffer
 * @property {number} index - Chunk index (0-based)
 */

/**
 * Split a WAV buffer into chunks of at most `maxDuration` seconds
 * with optional overlap between adjacent chunks.
 *
 * Only raw PCM WAV (format code 1) is supported. Non-PCM input
 * is returned as a single unsplit chunk.
 *
 * @param {Buffer} wavBuffer - Full decoded WAV buffer
 * @param {number} maxDuration - Maximum seconds per chunk
 * @param {number} [overlapSeconds=0] - Seconds of overlap between adjacent chunks
 * @returns {WavChunk[]}
 */
export function splitWavPcm(wavBuffer, maxDuration, overlapSeconds = 0) {
  if (!isWav(wavBuffer)) {
    return [{ buffer: wavBuffer, index: 0 }];
  }

  const fmt = readFmtChunk(wavBuffer);
  if (!fmt || fmt.audioFormat !== PCM_FORMAT) {
    return [{ buffer: wavBuffer, index: 0 }];
  }

  const data = findDataChunk(wavBuffer);
  if (!data || data.size === 0) {
    return [{ buffer: wavBuffer, index: 0 }];
  }

  const bytesPerSecond = fmt.sampleRate * fmt.channels * (fmt.bitsPerSample / 8);
  const totalDuration = data.size / bytesPerSecond;

  if (totalDuration <= maxDuration) {
    return [{ buffer: wavBuffer, index: 0 }];
  }

  const bytesPerChunk = Math.floor(maxDuration * bytesPerSecond);
  const overlapBytes = Math.floor(overlapSeconds * bytesPerSecond);
  const stride = bytesPerChunk - overlapBytes;
  const chunkCount = Math.ceil((data.size - bytesPerChunk) / stride) + 1;
  const chunks = [];

  for (let i = 0; i < chunkCount; i++) {
    const start = i * stride;
    const end = Math.min(start + bytesPerChunk, data.size);
    const chunkDataSize = end - start;

    if (chunkDataSize <= 0) break;

    chunks.push({
      buffer: buildWavHeader(fmt, chunkDataSize, wavBuffer, data.offset + start),
      index: i,
    });
  }

  return chunks;
}

/**
 * Check whether a buffer starts with a valid RIFF/WAVE header.
 *
 * @param {Buffer} buf - Input buffer
 * @returns {boolean}
 */
function isWav(buf) {
  return buf.length >= 12 &&
    buf.toString('ascii', 0, 4) === 'RIFF' &&
    buf.toString('ascii', 8, 12) === 'WAVE';
}

/**
 * Read the 'fmt ' sub-chunk from a WAV buffer.
 *
 * @param {Buffer} buf - WAV buffer
 * @returns {{ audioFormat: number, channels: number, sampleRate: number, bitsPerSample: number } | null}
 */
function readFmtChunk(buf) {
  let offset = 12;
  while (offset + 8 <= buf.length) {
    const id = buf.toString('ascii', offset, offset + 4);
    const size = buf.readUInt32LE(offset + 4);
    if (id === 'fmt ') {
      if (size < 16) return null;
      return {
        audioFormat: buf.readUInt16LE(offset + 8),
        channels: buf.readUInt16LE(offset + 10),
        sampleRate: buf.readUInt32LE(offset + 12),
        bitsPerSample: buf.readUInt16LE(offset + 22),
      };
    }
    offset += 8 + size;
    if (offset % 2) offset++;
  }
  return null;
}

/**
 * Find the 'data' sub-chunk offset and size within a WAV buffer.
 *
 * @param {Buffer} buf - WAV buffer
 * @returns {{ offset: number, size: number } | null}
 */
function findDataChunk(buf) {
  let offset = 12;
  while (offset + 8 <= buf.length) {
    const id = buf.toString('ascii', offset, offset + 4);
    const size = buf.readUInt32LE(offset + 4);
    const dataStart = offset + 8;
    if (id === 'data') {
      return { offset: dataStart, size };
    }
    offset += 8 + size;
    if (offset % 2) offset++;
  }
  return null;
}

/**
 * Build a self-contained WAV buffer from a PCM data slice.
 *
 * Produces a complete RIFF/WAVE header (44 bytes) followed by raw PCM data.
 *
 * @param {{ audioFormat: number, channels: number, sampleRate: number, bitsPerSample: number }} fmt - Format info
 * @param {number} dataSize - Size of PCM data to include
 * @param {Buffer} sourceBuf - Source WAV buffer
 * @param {number} sourceOffset - Byte offset in source where PCM data starts
 * @returns {Buffer} Complete WAV buffer with header + data
 */
function buildWavHeader(fmt, dataSize, sourceBuf, sourceOffset) {
  const headerSize = 44;
  const totalSize = headerSize + dataSize;
  const buf = Buffer.alloc(totalSize);
  const blockAlign = fmt.channels * (fmt.bitsPerSample / 8);
  const byteRate = fmt.sampleRate * blockAlign;

  buf.write('RIFF', 0, 'ascii');
  buf.writeUInt32LE(totalSize - 8, 4);
  buf.write('WAVE', 8, 'ascii');
  buf.write('fmt ', 12, 'ascii');
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(fmt.audioFormat, 20);
  buf.writeUInt16LE(fmt.channels, 22);
  buf.writeUInt32LE(fmt.sampleRate, 24);
  buf.writeUInt32LE(byteRate, 28);
  buf.writeUInt16LE(blockAlign, 32);
  buf.writeUInt16LE(fmt.bitsPerSample, 34);
  buf.write('data', 36, 'ascii');
  buf.writeUInt32LE(dataSize, 40);

  sourceBuf.copy(buf, headerSize, sourceOffset, sourceOffset + dataSize);

  return buf;
}
