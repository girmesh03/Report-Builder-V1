# Development Phases

## Phase Roadmap

| #  | Phase                                  | Scope                                                    |
|----|----------------------------------------|----------------------------------------------------------|
| 1  | Repository foundation and documentation| Git setup, env examples, package.json, docs, gitignore    |
| 2  | Backend foundation                     | Express server, Mongoose connection, config, middleware   |
| 3  | Authentication and profile API         | User model, auth routes, JWT, OAuth, profile endpoints   |
| 4  | Frontend foundation, routing, auth     | Vite scaffold, MUI setup, routes, auth pages             |
| 5  | Theme and reusable MUI components      | MUI theme, MuiTextField, MuiDialog, etc.                 |
| 6  | Protected dashboard and profile page   | Dashboard shell, sidebar, top bar, profile page           |
| 7  | Branch and report backend              | Branch + Report models, CRUD endpoints                   |
| 8  | Reports list/grid frontend             | Report list cards, MUI Data Grid, create report flow     |
| 9  | Audio recording frontend               | MediaRecorder, playback, discard, submit UI              |
| 10 | Audio upload backend                   | Multer, validation, audio metadata storage               |
| 11 | Addis AI speech-to-text integration    | STT service, transcription persistence                   |
| 12 | Transcription review and AI generation | Review UI, text generation service, report generation    |
| 13 | Report preview, edit, finalization     | Preview page, inline edits, status transitions           |
| 14 | Export system                          | PDF, TXT, CSV, spreadsheet exports                       |
| 15 | AI chat, translation, voice services   | Chat service, translate endpoint, TTS preparation        |
| 16 | Final hardening and verification       | Security audit, manual flow test, polish                 |

## Phase Protocol

Every phase follows six steps in order:

1. **Pre-Git Requirement** — check status, create feature branch.
2. **Comprehensive codebase analysis** — understand existing code.
3. **Analysis of all previous phases** — review prior work.
4. **Phase execution** — implement without deviation.
5. **User review and feedback** — present changes, get approval.
6. **Post-Git Requirement** — commit, merge, clean up (only after approval).
