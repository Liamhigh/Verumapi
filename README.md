<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1dYsvowYp1Gf55uhp3B5W2e4AA3_fO9ME

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create a `.env.local` file from the example:
   `cp .env.local.example .env.local`
3. Set your OpenAI API key in `.env.local`:
   - Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Replace `your_openai_api_key_here` with your actual API key
4. Run the app:
   `npm run dev`
