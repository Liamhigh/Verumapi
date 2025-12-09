<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Verum Omnis: AI Forensics for Truth

This contains everything you need to run and deploy your AI Studio app.

View your app in AI Studio: https://ai.studio/apps/drive/1dYsvowYp1Gf55uhp3B5W2e4AA3_fO9ME

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add your OpenAI API key from https://platform.openai.com/api-keys

3. Run the app:
   ```bash
   npm run dev
   ```

## Deploy to Production

### Deploy to Vercel (Recommended)

1. Install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Set your environment variable in Vercel:
   - Go to your project settings in Vercel Dashboard
   - Navigate to Environment Variables
   - Add `OPENAI_API_KEY` with your API key value

Alternatively, deploy directly from your GitHub repository by connecting it to Vercel.

### Deploy to Other Platforms

For other platforms (Netlify, Railway, etc.), ensure you:
1. Set the build command to `npm run build`
2. Set the output directory to `dist`
3. Add `OPENAI_API_KEY` as an environment variable

## Security

⚠️ **Important:** Never commit your `.env.local` file or expose your API keys in your code. This repository is configured to ignore environment files automatically.
