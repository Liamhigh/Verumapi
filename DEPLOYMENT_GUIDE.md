# Firebase Deployment and Android APK Setup Guide

This repository is configured to automatically deploy to Firebase Hosting and build signed Android APKs through GitHub Actions.

## Prerequisites

Before the GitHub Actions can successfully run, you need to set up the following:

### 1. Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select an existing one
   - Note your Project ID

2. **Enable Firebase Hosting**
   - In your Firebase project, go to "Hosting" in the left sidebar
   - Click "Get Started" and follow the setup

3. **Generate Firebase Service Account**
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file securely (you'll need it for GitHub secrets)

4. **Update `.firebaserc`**
   - Replace `your-firebase-project-id` in `.firebaserc` with your actual Firebase Project ID

### 2. GitHub Secrets Configuration

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions):

#### Firebase Secrets:
- `FIREBASE_SERVICE_ACCOUNT`: The entire content of the service account JSON file you downloaded
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `GEMINI_API_KEY`: Your Gemini API key for the application

#### Android Keystore Secrets:
- `ANDROID_KEYSTORE_BASE64`: Base64 encoded keystore file (see below)
- `KEYSTORE_PASSWORD`: The password for your keystore
- `KEY_ALIAS`: The alias name in your keystore (usually "release")
- `KEY_PASSWORD`: The password for the key alias

### 3. Creating an Android Keystore

If you don't have a keystore, create one:

```bash
keytool -genkey -v -keystore release.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000
```

Follow the prompts to set passwords and provide certificate information.

**Important:** Keep your keystore file and passwords safe. You cannot recover them if lost.

To encode your keystore for GitHub secrets:

```bash
base64 -i release.keystore | tr -d '\n' > keystore.base64.txt
```

Copy the content of `keystore.base64.txt` to the `ANDROID_KEYSTORE_BASE64` secret.

## GitHub Actions Workflows

### Firebase Deployment (`firebase-deploy.yml`)

**Triggers:**
- Push to `main` branch
- Pull requests to `main` branch
- Manual trigger via workflow_dispatch

**What it does:**
1. Checks out the code
2. Installs Node.js dependencies
3. Builds the Vite project
4. Deploys to Firebase Hosting

**Result:** Your web app is live on Firebase Hosting

### Android APK Build (`android-build.yml`)

**Triggers:**
- Push to `main` branch
- Tags starting with `v*` (e.g., v1.0.0)
- Pull requests to `main` branch
- Manual trigger via workflow_dispatch

**What it does:**
1. Checks out the code
2. Installs Node.js and Java dependencies
3. Builds the web app
4. Initializes Capacitor (converts web app to Android)
5. Builds debug APK (for PRs) or signed release APK (for main/tags)
6. Creates a GitHub release with the APK (for version tags)

**Result:** 
- Debug APK artifact for pull requests
- Signed release APK artifact for main branch pushes
- GitHub release with APK for version tags

## How to Use

### Deploying to Firebase

Simply push your changes to the `main` branch:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

The workflow will automatically build and deploy to Firebase.

### Building an APK

**For testing (Debug APK):**
Create a pull request, and the workflow will build a debug APK available in the workflow artifacts.

**For release (Signed APK):**
1. Push to main branch for a signed APK artifact
2. OR create a version tag for a GitHub release:

```bash
git tag v1.0.0
git push origin v1.0.0
```

This creates a signed APK and publishes it as a GitHub release.

## Troubleshooting

### Firebase Deployment Fails
- Verify `FIREBASE_SERVICE_ACCOUNT` secret is correctly set
- Check that `FIREBASE_PROJECT_ID` matches your Firebase project
- Ensure Firebase Hosting is enabled in your project

### Android Build Fails
- Verify all keystore secrets are correctly set
- Check that the keystore base64 encoding is complete (no line breaks)
- Ensure Java 17 is being used (configured in workflow)

### Build Succeeds but APK Won't Install
- Verify the keystore passwords are correct
- Check that the APK is properly signed
- Ensure the app permissions in Capacitor config are appropriate

## Manual Testing

To test the build process locally:

```bash
# Install dependencies
npm install

# Build web app
npm run build

# Install Capacitor (if not already installed)
npm install @capacitor/core @capacitor/cli @capacitor/android

# Initialize Capacitor (first time only)
npx cap init "Verum Omnis" "com.verumomnis.app" --web-dir=dist

# Add Android platform (first time only)
npx cap add android

# Sync changes
npx cap sync android

# Open in Android Studio
npx cap open android
```

Then build the APK from Android Studio.

## Additional Notes

- The web app requires a `GEMINI_API_KEY` environment variable to function
- Firebase will serve the built files from the `dist` directory
- The Android app ID is `com.verumomnis.app`
- Keystore files are excluded from git for security
- The `android/` directory is generated during build and excluded from git

## Support

For issues with:
- **Firebase:** Check [Firebase Documentation](https://firebase.google.com/docs/hosting)
- **Capacitor:** Check [Capacitor Documentation](https://capacitorjs.com/docs)
- **GitHub Actions:** Check the workflow run logs in the Actions tab
