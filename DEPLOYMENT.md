# Deployment Setup Guide

This guide explains how to set up Firebase deployment and Android APK signing for the Verum Omnis application.

## Prerequisites

1. Node.js 20 or later
2. Java 17 (required for Android Gradle builds)
3. Android SDK (for local Android builds)
4. Firebase account and project
5. Android keystore for signing APKs

## Firebase Hosting Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Firebase Hosting

### 2. Get Firebase Service Account

1. In Firebase Console, go to Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Download the JSON file

### 3. Configure GitHub Secrets

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions):

- `FIREBASE_SERVICE_ACCOUNT`: Paste the entire contents of the service account JSON file
- `FIREBASE_PROJECT_ID`: Your Firebase project ID (e.g., `verum-omnis-app`)
- `OPENAI_API_KEY`: Your OpenAI API key for the application

## Android APK Signing Setup

### 1. Generate Android Keystore

Run the following command to create a new keystore:

```bash
keytool -genkey -v -keystore release.keystore -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

You will be prompted for:
- Keystore password (remember this!)
- Key password (remember this!)
- Your name, organization, location, etc.

**Important**: Keep your keystore file and passwords secure! Never commit the keystore to git.

### 2. Encode Keystore to Base64

```bash
base64 -i release.keystore -o release.keystore.base64
```

Or on Linux/Mac:
```bash
cat release.keystore | base64 > release.keystore.base64
```

### 3. Configure GitHub Secrets for Android

Add these secrets to your GitHub repository:

- `ANDROID_KEYSTORE_BASE64`: Contents of the `release.keystore.base64` file
- `ANDROID_KEYSTORE_PASSWORD`: The keystore password you set
- `ANDROID_KEY_PASSWORD`: The key password you set
- `ANDROID_KEY_ALIAS`: The alias you used (e.g., `upload`)

## Local Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Android Development

#### Sync Android Project

```bash
npm run android:sync
```

#### Build Signed APK Locally

```bash
npm run android:build
```

Note: For local builds, you need to create `android/keystore.properties`:

```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=upload
storeFile=../release.keystore
```

## Deployment Workflow

The GitHub Actions workflow (`deploy.yml`) automatically:

1. **On push to `main` branch** or **manual trigger**:
   - Builds the web application
   - Deploys to Firebase Hosting
   - Builds a signed Android APK
   - Uploads APK as an artifact
   - Creates a GitHub release with the APK

### Manual Deployment

You can manually trigger the workflow:

1. Go to Actions tab in your GitHub repository
2. Select "Deploy to Firebase and Build Android APK"
3. Click "Run workflow"
4. Select the branch and click "Run workflow"

## Security Checklist

- [x] `.env.local` is in `.gitignore`
- [x] `release.keystore` is in `.gitignore`
- [x] `keystore.properties` is in `.gitignore`
- [x] All sensitive values are in GitHub Secrets
- [x] Firebase service account is not committed to repository
- [x] OpenAI API key is configured as environment variable

## Verifying the Setup

### Test Firebase Deployment

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not done)
firebase init hosting

# Deploy manually to test
npm run build
firebase deploy --only hosting
```

### Test Android Build

```bash
# Make sure you have the Android SDK installed
# Set ANDROID_HOME environment variable

# Install Capacitor
npm install

# Sync and build
npm run android:sync
cd android
./gradlew assembleRelease
```

The signed APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

## Troubleshooting

### Firebase Deployment Fails

- Verify `FIREBASE_SERVICE_ACCOUNT` secret is correctly formatted JSON
- Ensure Firebase Hosting is enabled for your project
- Check `FIREBASE_PROJECT_ID` matches your Firebase project

### Android Build Fails

- Verify all keystore secrets are set correctly
- Ensure Java 17 is installed
- Check that the keystore alias matches what you used when creating the keystore
- Verify Android SDK is properly installed

### Environment Variables Not Working

- Ensure `OPENAI_API_KEY` is set in GitHub Secrets
- Check that the workflow file correctly passes the environment variable
- Verify Vite configuration includes the environment variable in `define`

## Support

For issues or questions, please open an issue in the GitHub repository.
