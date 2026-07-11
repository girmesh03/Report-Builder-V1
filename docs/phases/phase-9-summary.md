# Phase 9 — Audio Recording Frontend

## Summary

Implemented browser-based audio recording for the report creation workflow. Users can record, stop, play back, discard, and re-record audio using the MediaRecorder API. The 10 MB file size limit is enforced client-side. No fixed duration limit.

## Files Created

### `client/src/utils/audioUtils.js`
- `getSupportedMimeType()` — detects best supported MIME type per ADR-005 priority (`audio/webm;codecs=opus` → `audio/webm` → `audio/mp4` → browser default).
- `formatDuration(seconds)` — formats seconds to `m:ss` string.
- `formatFileSize(bytes)` — formats bytes to human-readable B/KB/MB.
- `isOverSizeLimit(bytes)` — checks if file exceeds 10 MB (MAX_FILE_SIZE constant).

### `client/src/hooks/useAudioRecorder.js`
- Custom hook encapsulating all MediaRecorder state and lifecycle.
- State machine: `idle` → `recording` → `recorded`.
- Manages microphone stream acquisition, timer, chunks collection.
- Creates Blob + Object URL on stop; revokes URLs on discard/cleanup.
- Handles errors: permission denied, no microphone, general failure.
- Audio blob stored in component-local refs — NOT in Redux or localStorage (per ADR-005).
- Cleanup on unmount: stops timer, stops stream tracks, revokes object URLs.
- Returns: `state`, `duration`, `error`, `mimeType`, `audioBlob`, `audioUrl`, `fileSize`, `isRecording`, `isRecorded`, `isIdle`, `startRecording`, `stopRecording`, `discardRecording`.

### `client/src/components/audio/AudioRecorder.jsx`
- Main component composing all sub-components.
- Shows guidelines when idle, recording meter when recording, playback controls when recorded.
- Alerts on errors and over-size-limit warnings.
- Calls `onSubmit` prop when user clicks submit with valid audio.
- Submit button disabled when audio exceeds 10 MB.

### `client/src/components/audio/AudioRecordingControls.jsx`
- Contextual button set: Start Recording (idle), Stop Recording (recording), Discard + Re-record (recorded).
- Uses MuiButton with appropriate icons (Mic, Stop, Delete, Refresh) and aria-labels.
- Re-record triggers discard flow (resets to idle state for fresh recording).

### `client/src/components/audio/AudioRecordingMeter.jsx`
- Visual recording indicator: pulsing red circle + elapsed time in monospace.
- Duration displayed in `m:ss` format, updated every 250ms during recording.

### `client/src/components/audio/AudioPlayback.jsx`
- Play/pause toggle with native HTMLAudioElement.
- Shows remaining/total duration during playback.
- Displays file size (KB) and MIME type.
- Submit button with CheckCircle icon, disabled when over size limit.

### `client/src/components/audio/AudioGuidelines.jsx`
- Info card with recording tips: speak clearly in Amharic, quiet environment, mention date/branches/activities, 10 MB limit, no fixed duration.

### `client/src/pages/reports/CreateReportPage.jsx`
- Replaced disabled "Record Audio (Coming Soon)" button with live AudioRecorder.
- Submit handler shows success toast (react-toastify) and inline success Alert.
- Audio upload integration deferred to Phase 10.

## Key Design Decisions

- **No fixed duration limit**: per ADR-005, users can record as long as needed within 10 MB.
- **10 MB enforced client-side**: after recording stops, blob size is checked. Submit blocked if exceeded, with warning to re-record.
- **Transient audio state**: blob stored in hook refs, not Redux or localStorage (ADR-005).
- **Chunked STT prepared**: frontend sends full blob as single upload; backend chunks for STT (Phase 11).
- **MIME priority**: detects best supported format; browsers default to WebM with Opus.
- **react-toastify**: infrastructure existed but was unused; first consumer is the audio submit handler.
- **Silent/empty audio detection**: recordings smaller than 2 KB are treated as silent/empty. Submit is blocked with a warning to re-record with clear speech. Originally deferred to Phase 11+ (per phase-7-summary.md:39); moved to Phase 9 for proactive edge-case handling.

## Alignment with Documentation

- ADR-005: ✅ No fixed duration, 10 MB limit, MIME priority, transient state.
- ARCHITECTURE.md: ✅ audio/ directory structure, hook pattern, component composition.
- PROBLEM_STATEMENT.md: ✅ Steps 6-9 (record, listen, re-record, submit).
- PRD.md: ✅ Browser-based recording, playback, discard, re-record, size validation.
- RULES.md: ✅ Sections 22 (ADR-005), 10 (UI English), 8 (MUI patterns), 9 (no watch), 13 (transient state).
- DEVELOPMENT_PHASES.md: ✅ Phase 9 scope delivered.
- phase-7-summary.md:39: ✅ Silent/empty audio edge case handled in Phase 9 instead of Phase 11+ (client-side < 2 KB check + block + warning).

## Manual Verification Checklist

- [ ] Record audio: click Start Recording → microphone permission prompt → recording begins.
- [ ] Stop recording: click Stop Recording → playback controls appear.
- [ ] Playback: click Play button → audio plays; click again → pauses.
- [ ] Discard: click Discard → resets to idle, ready for fresh recording.
- [ ] Re-record: click Re-record → resets to idle, ready for fresh recording.
- [ ] Duration: elapsed time updates every 250ms during recording.
- [ ] File info: size (KB) and MIME type shown after recording.
- [ ] 10 MB limit: record long audio → warning shown, submit disabled.
- [ ] Silent audio: record without speaking (~1 sec) → "empty" warning shown, submit disabled.
- [ ] Submit: valid audio → Submit button active; clicking shows success toast.
- [ ] Mobile layout: controls stack vertically on narrow screens.
- [ ] Error handling: deny microphone → error alert shown.
