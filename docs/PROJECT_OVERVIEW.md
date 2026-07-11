# Project Overview

## Purpose

Report Builder V1 is a MERN stack application that helps an area supervisor quickly create professional daily branch-visit reports. The supervisor works for a company with more than 14 branches in Addis Ababa, Ethiopia. Each day the supervisor visits one or more branches and produces a structured report for a boss.

The app turns recorded activity audio into a reviewed transcription and then into a structured daily report using Addis AI.

## Goals

- Reduce daily reporting effort.
- Capture activity details immediately through audio.
- Support Amharic and English in audio, transcription, AI chat, and report content.
- Keep the application UI in English.
- Allow transcription review before AI report generation.
- Generate structured reports via AI system prompt.
- Preview and export reports as PDF, TXT, CSV, and spreadsheet.
- Provide a secure full-stack foundation with authentication and MongoDB persistence.

## Core Workflow

1. Landing page → Register / Login / OAuth.
2. Protected dashboard with sidebar navigation.
3. Reports page (card + grid view).
4. Create report → select date and branch(es).
5. Record audio → review → submit.
6. Backend calls Addis AI STT → transcription returned.
7. User reviews and edits transcription.
8. Reviewed transcription sent to Addis AI text generation.

**Accuracy note:** Transcription accuracy is the highest priority quality metric. The chunking pipeline (ffmpeg WAV → PCM split) and correct chunk MIME type are mandatory. See RULES.md rules 13.21-13.25.
9. Generated report previewed → user edits if needed.
10. Export as PDF, TXT, CSV, or spreadsheet.

## Language Rules

- App shell, navigation, labels, buttons, and validation are in English.
- Audio, transcription, AI chat, and report content can be Amharic, English, or mixed.
- No forced translation unless the user explicitly chooses it.
