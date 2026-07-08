# ADR-005: Audio Recording Strategy — Flexible Duration, 10 MB Limit, Chunked STT

**Date:** 2026-07-07

## Context

The Report Builder app requires browser-based audio recording for branch visit reports. The recorded audio is sent to Addis AI STT for transcription. Key constraints and decisions:

1. **Addis AI STT per-request duration limit** is approximately 60 seconds.
2. **File size limit** for uploads is 10 MB (enforced by body parser and Addis AI).
3. Users need to record branch visit audio on the go, and recording duration varies — some visits may need longer descriptions.
4. A hard 60-second auto-stop would force users into multiple recordings for longer visits, creating a poor UX.

## Decision

### 1. No Fixed Duration Limit

The frontend does **not** stop recording at 60 seconds. Users can record as long as they need, limited only by the 10 MB file size constraint.

### 2. 10 MB File Size Limit Enforced Client-Side

After recording stops, the audio blob's actual size is checked client-side:
- If `blob.size ≤ 10 MB`: submit is allowed.
- If `blob.size > 10 MB`: submit is blocked, warning shown, user asked to re-record shorter audio.

This replaces the original "60-second auto-stop + approaching-60s warning" approach.

### 3. Chunked STT Processing (Backend)

Long recordings exceeding Addis AI's per-request duration limit will be split into chunks by the backend before being sent to STT. Each chunk is processed independently and the results are concatenated. The frontend is agnostic to this — it sends the full blob as a single upload.

### 4. Transient State, No Redux Persist

The audio blob is stored in component-local state (`useState` + `useRef` in a custom hook). It is not persisted to Redux, `redux-persist`, or localStorage. This avoids bloating persisted state with large binary data.

### 5. Preferred MIME Type Detection

The browser's `MediaRecorder` is configured with the first supported MIME type from this priority list:
1. `audio/webm;codecs=opus`
2. `audio/webm`
3. `audio/mp4`
4. Browser default (empty string, `MediaRecorder` chooses)

## Consequences

- **Positive**: Users can record long branch visits without interruption. Better UX for complex or multi-branch visits.
- **Positive**: The 10 MB file size limit provides a predictable, measurable constraint that users can self-manage (shorter recording = smaller file).
- **Positive**: Chunked STT processing is transparent to the frontend — no change needed when chunking is implemented on the backend (Phase 11).
- **Positive**: Transient state avoids Redux persist bloat and unintentional large localStorage writes.
- **Negative**: Users may create recordings too long (>10 MB) and have to re-record, but the warning is clear and immediate after stop.
- **Negative**: Chunked STT may produce slightly less coherent transcriptions at chunk boundaries (mitigated by overlap).
- **Documentation**: Updated `docs/prompts/phases/9-audio-recording-frontend.md` to remove 60s limit references. Updated `docs/PRD.md` and `docs/prompts/initial-one-time-prompt.md`.
