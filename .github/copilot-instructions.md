# Copilot Instructions for Verum Omnis

## Project Overview
Verum Omnis is a forensic AI chat application for legal/investigative use. It's a React + TypeScript + Vite SPA with Capacitor for Android builds, using Google's Gemini AI via a custom SDK alias.

## Architecture

### Core Components
- **App.tsx**: Main chat orchestrator. Manages message state, streaming responses, and PDF generation triggers
- **services/aiService.ts**: Re-exports Gemini SDK as `@verum-omnis/ai-sdk` alias. Contains `systemInstruction` prompt defining the AI's forensic persona
- **services/geminiService.ts**: Duplicate of aiService.ts (legacy, prefer aiService.ts for edits)
- **types.ts**: Single source for `ChatMessage` interface with forensic metadata (seal, actions, pdfContent)

### Key Patterns

**Streaming AI Responses**: Uses async generators. The pattern in `App.tsx`:
```typescript
const stream = streamAIResponse(contents);
for await (const chunk of stream) {
  // Append chunk.text to accumulating response
  // Update last message in state incrementally
}
```

**Forensic Seals**: SHA-512 hashes generated via `generateSha512()` for AI responses. Displayed as QR codes in PDFs.

**PDF Generation**: AI wraps documents in `[START OF DOCUMENT]...[END OF DOCUMENT]` tags. `App.tsx` parses this, sets `isPdfContent: true`, and passes `pdfContent` to `ChatMessage.tsx` which renders with html2canvas + jsPDF.

**Action Parsing**: AI responses containing `**Step [A-Z]:**` get parsed into clickable action buttons. See `parseActions()` regex in `App.tsx`.

## Development Workflows

**Local Development**:
```bash
npm install
# Create .env.local with OPENAI_API_KEY=<your-gemini-key>
npm run dev  # Runs on port 3000
```

**Android Builds**:
```bash
npm run android:build  # Requires Java 17, Android SDK, and release.keystore
npm run android:open   # Open in Android Studio
```

**Deployment**: Push to `main` triggers Firebase Hosting deploy via GitHub Actions (`.github/workflows/deploy.yml`).

## Critical Environment Setup

**API Key Mapping**: Vite config (`vite.config.ts`) maps `OPENAI_API_KEY` → `process.env.API_KEY` for the Gemini client. Both env vars point to the same Gemini key.

**SDK Alias**: `@verum-omnis/ai-sdk` resolves to `@google/genai` via Vite alias. Don't import `@google/genai` directly.

**Model Name**: Hardcoded as `gemini-3-pro-preview` in `aiService.ts` (not exposed to UI).

## Project-Specific Conventions

- **No Backend**: All AI calls are client-side. API key is bundled (not production-secure, but documented in README).
- **Stateless AI**: The `systemInstruction` emphasizes deterministic, constitutional governance. Don't add memory/persistence features.
- **Legal Theming**: UI uses dark blue/slate palette (`#0A192F` backgrounds). Maintain formal, forensic tone in copy.
- **File Handling**: Images/PDFs uploaded as base64. See `fileToBase64()` in `App.tsx`. Passed as `inlineData` parts to Gemini.
- **Message History**: Entire conversation sent to AI each turn (no backend). First message (system greeting) is skipped via `history.slice(1)`.

## Integration Points

- **Capacitor**: Android-specific config in `capacitor.config.json`. Keystore path for signed APKs.
- **Firebase Hosting**: Deploys `dist/` folder. No functions or Firestore (static hosting only).
- **GitHub Actions**: Secrets required: `FIREBASE_SERVICE_ACCOUNT`, `OPENAI_API_KEY` (for build-time injection).

## When Editing

- **AI Behavior Changes**: Edit `systemInstruction` in `services/aiService.ts` (not geminiService.ts).
- **Message Schema Changes**: Update `types.ts` `ChatMessage` interface, then check `App.tsx` streaming logic and `ChatMessage.tsx` rendering.
- **PDF Layout**: Modify `ChatMessage.tsx` `handleDownloadPdf()`. Canvas scale is 2x, background `#0A192F`.
- **Action Button Logic**: Adjust `parseActions()` regex in `App.tsx` if AI output format changes.
