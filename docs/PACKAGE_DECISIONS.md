# Package Decisions

## Backend Packages

| Package                  | Purpose                                           |
|--------------------------|---------------------------------------------------|
| bcryptjs                 | Password hashing (replaced bcrypt — pure JS, no native deps) |
| compression              | Gzip/brotli response compression                  |
| cookie-parser            | Parse httpOnly auth cookies                       |
| cors                     | Cross-origin requests from client origin          |
| dayjs                    | Lightweight date manipulation                     |
| dotenv                   | Load environment variables from .env              |
| express                  | Web framework                                     |
| express-async-handler    | Wrap async route handlers                         |
| express-mongo-sanitize   | Prevent NoSQL injection                           |
| express-rate-limit       | Rate limiting (auth + AI endpoints)               |
| express-validator        | Request validation                                |
| helmet                   | Secure HTTP headers                               |
| jsonwebtoken             | JWT creation and verification                     |
| mongoose                 | MongoDB ODM                                       |
| mongoose-paginate-v2     | Pagination plugin                                 |
| multer                   | Multipart file upload (audio)                     |
| validator                | String validation helpers                         |

## Backend Dev Packages

| Package | Purpose                     |
|---------|-----------------------------|
| morgan  | HTTP request logging (dev)  |
| nodemon | Auto-restart on file change |

## Client Packages

| Package                  | Purpose                                    |
|--------------------------|--------------------------------------------|
| @emotion/react           | CSS-in-JS engine (MUI dependency)          |
| @emotion/styled          | Styled components (MUI dependency)         |
| @fontsource/inter        | Inter font self-hosting                    |
| @mui/icons-material      | MUI icon set                               |
| @mui/lab                 | MUI lab components (unstable)              |
| @mui/material            | Core MUI component library                 |
| @mui/x-charts            | MUI charts                                 |
| @mui/x-data-grid         | Data grid (community edition)              |
| @mui/x-date-pickers      | Date/time pickers                          |
| @reduxjs/toolkit         | Redux state management                     |
| dayjs                    | Date manipulation (MUI picker adapter)     |
| exceljs                  | Spreadsheet export (XLSX)                  |
| file-saver               | Trigger file downloads from Blob           |
| jspdf                    | PDF generation                              |
| jspdf-autotable          | PDF table plugin                           |
| react                    | UI library                                 |
| react-dom                | React DOM renderer                         |
| react-error-boundary     | React error boundary wrapper               |
| react-hook-form          | Form state management                      |
| react-redux              | React-Redux bindings                       |
| react-router             | Client-side routing                        |
| react-toastify           | Toast notifications                        |
| redux-persist            | Redux state persistence                    |

## Client Dev Packages

| Package               | Purpose                      |
|-----------------------|------------------------------|
| @vitejs/plugin-react  | Vite React plugin            |
| oxlint                | Fast linter                  |
| vite                  | Build tool and dev server    |

## Client Type Packages (Dev Only — Editor IntelliSense)

| Package               | Purpose                      |
|-----------------------|------------------------------|
| @types/react          | React type definitions (dev-only, no runtime impact) |
| @types/react-dom      | React DOM type definitions (dev-only, no runtime impact) |

## Packages NOT Installed (With Reasons)

| Package               | Reason                                                                 |
|-----------------------|------------------------------------------------------------------------|
| `cookie`              | No server-side cookie manipulation needed beyond cookie-parser parsing |
| `dotenv` (client)     | Vite already loads env variables; frontend `dotenv` is not needed      |
| `bcrypt` → `bcryptjs` | `bcrypt` requires native compilation (node-gyp/VS Build Tools on Windows). `bcryptjs` is a drop-in pure-JS replacement with identical API. |
| `react-query`         | Not in initial requirements; Redux Toolkit handles server state        |
| `axios`               | Native `fetch` is sufficient for backend; frontend uses fetch          |
| Tailwind CSS          | MUI sx/styled is the designated styling approach                       |
| TypeScript            | JavaScript-only project                                                |
| Next.js               | React + Vite is the designated stack                                   |
| Testing frameworks    | No automated tests in initial scope                                    |
| OAuth provider SDKs   | Provider not yet selected; will install when provider is chosen        |
