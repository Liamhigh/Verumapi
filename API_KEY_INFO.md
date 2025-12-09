# Important: API Key Information

## ⚠️ API Key Notice

The API key you provided appears to be an **OpenAI API key** (format: `sk-proj-...`).

However, this application uses **Google's Gemini AI**, which requires a different API key.

## Getting the Correct API Key

### Option 1: Use Gemini (Recommended - Already Configured)

1. Visit: https://aistudio.google.com/apikey
2. Sign in with your Google account
3. Click "Create API Key" or "Get API Key"
4. Copy your Gemini API key
5. Add it to your `.env.local` file:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Option 2: Switch to OpenAI (Requires Code Changes)

If you prefer to use OpenAI instead of Gemini, you'll need to:

1. Replace the `@google/genai` package with OpenAI's SDK
2. Update `App.tsx` to use OpenAI's API
3. Update `services/geminiService.ts` 
4. Change environment variable name from `GEMINI_API_KEY` to `OPENAI_API_KEY`

This would require significant code changes and is not recommended unless you have a specific reason to use OpenAI.

## GitHub Actions Setup

When you're ready to set up automated builds, add your Gemini API key to GitHub Secrets:

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `GEMINI_API_KEY`
5. Value: Your Gemini API key
6. Click "Add secret"

## Running Locally Right Now

Since the application is already configured for Gemini:

1. Get a Gemini API key (free tier available)
2. Create `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Edit `.env.local` and add your Gemini key
4. Run the app:
   ```bash
   npm run dev
   ```

## Need Help?

- Gemini API Documentation: https://ai.google.dev/docs
- OpenAI API Documentation: https://platform.openai.com/docs

The application is currently optimized for Gemini AI and includes specific system instructions tailored for the legal AI use case.
