# Phase 9 - Audio Recording Frontend

## Phase Goal

Build the browser audio recording experience for report creation, including record, stop, playback, discard, re-record, duration/size guidance, and submit preparation. Do not integrate backend audio upload yet unless the backend endpoint already exists.

## Mandatory Phase Protocol

### Step 1: Pre-Git Requirement

Run `git status`, `git branch -vv`, and `git fetch origin`. Handle missing remote, uncommitted changes, behind branches, and conflicts exactly as required. Create `phase-9-audio-recording-frontend`. Verify state before implementation.

### Step 2: Comprehensive And Extremely Deep Codebase Analysis

Read the reports UI, create report workflow, reusable components, route structure, state slices, docs, and previous phase summaries.

### Step 3: Comprehensive And Extremely Deep Analysis Of Previously Implemented All Phases

Analyze Phases 1-8. Ensure the audio UI attaches naturally to the draft report workflow.

### Step 4: Phase Execution Without Deviation

Implement audio recording frontend.

Required files:

```text
client/src/components/audio/AudioRecorder.jsx
client/src/components/audio/AudioPlayback.jsx
client/src/components/audio/AudioRecordingControls.jsx
client/src/components/audio/AudioRecordingMeter.jsx
client/src/components/audio/AudioGuidelines.jsx
client/src/hooks/useAudioRecorder.js
client/src/utils/audioUtils.js
client/src/pages/reports/CreateReportPage.jsx
```

Audio UX:

- User can start recording.
- User can stop recording.
- User can play recorded audio.
- User can discard recording.
- User can re-record before submission.
- User sees elapsed duration.
- User sees file type and actual size after recording.
- If file size exceeds 10 MB, block submit and ask user to re-record shorter audio.
- Submit button remains disabled until a valid recording exists.
- Audio is not uploaded until user clicks submit.
- No fixed duration limit — user can record as much as they want.
- Long recordings exceeding Addis AI STT per-request duration will be chunked by the backend for transcription processing.

Implementation:

- Use browser `MediaRecorder`.
- Prefer MIME type supported by browser in this order:
  - `audio/webm;codecs=opus`
  - `audio/webm`
  - `audio/mp4`
  - fallback supported type from `MediaRecorder.isTypeSupported`
- Create a Blob and object URL for playback.
- Revoke old object URLs to avoid memory leaks.
- Store only transient recording state in component/hook until submission.
- Do not store audio blob in Redux persist.

Accessibility:

- Buttons have clear accessible labels.
- Recording state is visible.
- Keyboard users can operate controls.

MUI and form rules:

- Use reusable MUI components where applicable.
- Use icons for record/stop/play/delete actions.
- Tree-shaking imports.
- No deprecated MUI props.
- No Tailwind.
- No React Hook Form `watch`.
- No tests.
- JSDoc block comments everywhere.

Create report page:

- Show report metadata summary.
- Show audio recorder as the next step.
- Show a clear path back to reports.
- Do not implement STT response UI yet.

Update docs:

- `docs/phases/phase-9-summary.md`
- Update product workflow docs if needed.

Manual verification:

- Record audio.
- Stop and play.
- Discard and re-record.
- Verify long recordings (exceeding 60s) work correctly.
- Verify mobile layout.

### Step 5: User Review And Feedback Integration

Present audio recording behavior, browser limitations, commands run, and manual verification. Ask for explicit approval before Step 6.

### Step 6: Post-Git Requirement

After explicit approval only, complete Git status/fetch/diff/stage/commit/push/merge/delete/verify using commit message `feat: phase 9 audio recording frontend`.

## Phase Completion Criteria

- Recording UI works.
- Playback works.
- Re-record flow works.
- 10 MB file size limit is enforced in UI (submit blocked, re-record prompted).
- No fixed duration limit — user can record as much as they want within the 10 MB file size constraint.
- Backend processes long audio by chunking for Addis AI STT.
