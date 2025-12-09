<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Verum Omnis - AI Forensics for Truth

**The World's First Legal AI** - Making justice accessible to everyone on the planet for free.

This repository contains the Verum Omnis chat interface, powered by Google's Gemini AI, ready for deployment as a web app (Firebase) or Android app (Capacitor).

View your app in AI Studio: https://ai.studio/apps/drive/1dYsvowYp1Gf55uhp3B5W2e4AA3_fO9ME

## 🚀 Quick Start

### Prerequisites
- Node.js 20 or later
- npm or yarn
- Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/Liamhigh/Verumapi.git
   cd Verumapi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   ```bash
   cp .env.example .env.local
   ```
   - Edit `.env.local` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
5. Open your browser to `http://localhost:3000`

## 📱 Android App (Capacitor)

### Build Android APK Locally

1. **Build the web app**
   ```bash
   npm run build
   ```

2. **Sync Capacitor**
   ```bash
   npx cap sync android
   ```

3. **Open in Android Studio**
   ```bash
   npx cap open android
   ```

4. Build the APK from Android Studio or use Gradle:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

### Automated APK Build with GitHub Actions

The repository includes a GitHub Actions workflow that automatically builds and signs the Android APK.

**Required Secrets (set in GitHub repository settings):**
- `GEMINI_API_KEY` - Your Gemini API key
- `SIGNING_KEY_BASE64` - Base64 encoded keystore file
- `KEY_ALIAS` - Keystore alias
- `KEY_STORE_PASSWORD` - Keystore password
- `KEY_PASSWORD` - Key password

**To generate a signing key:**
```bash
keytool -genkey -v -keystore verum-omnis.keystore -alias verum-omnis -keyalg RSA -keysize 2048 -validity 10000
```

**To encode keystore for GitHub Secrets:**
```bash
base64 -i verum-omnis.keystore | pbcopy  # macOS
base64 -i verum-omnis.keystore | xclip   # Linux
```

The workflow runs on every push to `main` and creates a release with the signed APK.

## ☁️ Firebase Deployment

### Deploy to Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase (first time only)**
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory to: `dist`
   - Configure as single-page app: `Yes`
   - Don't overwrite `index.html`

4. **Build and deploy**
   ```bash
   npm run build
   firebase deploy
   ```

### Automated Firebase Deployment with GitHub Actions

The repository includes a GitHub Actions workflow for automatic Firebase deployment.

**Required Secrets:**
- `GEMINI_API_KEY` - Your Gemini API key
- `FIREBASE_SERVICE_ACCOUNT` - Firebase service account JSON
- `FIREBASE_PROJECT_ID` - Your Firebase project ID

The workflow deploys automatically on every push to `main`.

## 🔧 Configuration Files

- `capacitor.config.ts` - Capacitor configuration
- `firebase.json` - Firebase Hosting configuration
- `vite.config.ts` - Vite build configuration
- `.env.example` - Environment variables template

## 🛡️ Security

- All dependencies are regularly updated for security patches
- jsPDF has been updated to v3.0.2 to fix known vulnerabilities
- API keys should never be committed to the repository
- Use GitHub Secrets for CI/CD workflows

## 📦 Build Output

- Web build: `dist/` directory
- Android APK: `android/app/build/outputs/apk/release/`

## 🤝 Contributing

This is a legal AI platform designed to provide free access to justice. Contributions are welcome!

## 📄 License

See repository license for details.
