<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Verum Omnis - AI Forensics for Truth

[![Deploy to Firebase](https://github.com/Liamhigh/Verumapi/actions/workflows/firebase-deploy.yml/badge.svg)](https://github.com/Liamhigh/Verumapi/actions/workflows/firebase-deploy.yml)
[![Build Android APK](https://github.com/Liamhigh/Verumapi/actions/workflows/android-build.yml/badge.svg)](https://github.com/Liamhigh/Verumapi/actions/workflows/android-build.yml)

This is an AI-powered forensics application built with React, Vite, and OpenAI.

View your app in AI Studio: https://ai.studio/apps/drive/1dYsvowYp1Gf55uhp3B5W2e4AA3_fO9ME

## 🚀 Deployment & Distribution

This repository is configured for automated deployment and distribution:

- **🌐 Firebase Hosting**: Automatic deployment to Firebase on every push to main
- **📱 Android APK**: Automated signed APK builds for mobile distribution

### Quick Setup

1. **[Setup GitHub Secrets](SECRETS_SETUP.md)** - Configure required secrets for deployments
2. **[Firebase Deployment Guide](DEPLOYMENT_GUIDE.md)** - Detailed Firebase setup instructions
3. **[Android Build Config](ANDROID_BUILD_CONFIG.md)** - Android APK signing configuration

## Run Locally

**Prerequisites:**  Node.js 20+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `OPENAI_API_KEY` in [.env.local](.env.local):
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser

## Build

Build the production version:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```
