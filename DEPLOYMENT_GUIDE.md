# Firebase Deployment and GitHub Actions Setup Guide

## Overview

This guide covers setting up Firebase Hosting deployment and GitHub Actions workflows for building Android APKs.

## Firebase Hosting Setup

### Prerequisites
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase account at https://console.firebase.google.com

### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Add project" or select existing project
3. Follow the setup wizard
4. Enable "Hosting" from the left sidebar

### Step 2: Initialize Firebase in Your Project

```bash
# Login to Firebase
firebase login

# Initialize Firebase (select Hosting)
firebase init hosting

# When prompted:
# - Select your Firebase project
# - Set public directory to: dist
# - Configure as single-page app: Yes
# - Set up automatic builds with GitHub: No (we'll use GitHub Actions)
```

This creates:
- `firebase.json` (already included in repo)
- `.firebaserc` (contains your project ID)

### Step 3: Create `.firebaserc`

Create `.firebaserc` in the root directory:

```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

Replace `your-firebase-project-id` with your actual project ID from Firebase Console.

### Step 4: Test Manual Deployment

```bash
# Build the app
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

Visit the URL provided by Firebase to verify deployment.

## GitHub Actions Setup

### Required GitHub Secrets

Navigate to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

#### 1. FIREBASE_SERVICE_ACCOUNT

Generate a service account key:

```bash
# Login to Firebase
firebase login

# Generate CI token (deprecated but simpler)
firebase login:ci
# Copy the token and add as FIREBASE_SERVICE_ACCOUNT secret

# OR use Service Account (recommended):
# 1. Go to Firebase Console → Project Settings → Service Accounts
# 2. Click "Generate New Private Key"
# 3. Save the JSON file
# 4. Copy entire JSON content and add as FIREBASE_SERVICE_ACCOUNT secret
```

#### 2. FIREBASE_PROJECT_ID

Add your Firebase project ID as a secret (e.g., `verum-omnis-12345`)

### Workflow Files

Two GitHub Actions workflows are included:

#### 1. `firebase-deploy.yml` - Firebase Hosting Deployment

**Triggers:**
- Push to `main` branch
- Manual trigger via GitHub UI

**What it does:**
1. Checks out code
2. Installs Node.js dependencies
3. Builds the web app
4. Deploys to Firebase Hosting

#### 2. `build-apk.yml` - Android APK Build

**Triggers:**
- Push to `main` or `copilot/**` branches
- Pull requests to `main`
- Manual trigger via GitHub UI

**What it does:**
1. Checks out code
2. Installs dependencies
3. Builds web app
4. Checks if Capacitor is initialized
5. If yes: Syncs and builds Android APK
6. If no: Provides instructions for setup
7. Uploads APK as artifact (available for 30 days)

**Note:** Currently Capacitor is not initialized. See "Capacitor Setup" below.

## Capacitor Setup (for Android APK builds)

### Step 1: Install Capacitor

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### Step 2: Initialize Capacitor

```bash
npx cap init
# When prompted:
# - App name: Verum Omnis
# - App ID: com.verumomnis.forensics (or your preferred ID)
# - Web asset directory: dist
```

This creates `capacitor.config.ts`

### Step 3: Add Android Platform

```bash
npx cap add android
```

This creates the `android/` directory with Gradle project.

### Step 4: Configure Android

Edit `android/app/build.gradle` to set:
- Minimum SDK version
- Target SDK version
- App version
- Permissions

### Step 5: Build and Test Locally

```bash
# Build web app
npm run build

# Sync with Capacitor
npx cap sync android

# Open in Android Studio
npx cap open android

# Or build from command line
cd android
./gradlew assembleDebug
```

APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

### Step 6: Commit Capacitor Files

```bash
git add capacitor.config.ts android/
git commit -m "Add Capacitor Android platform"
git push
```

After this, GitHub Actions will automatically build APKs on every push.

## APK Signing for Production

For production releases, follow the guide in `CRYPTOGRAPHIC_SEALING_AND_APK_SIGNING.md`.

### Quick Summary:

1. **Generate Keystore:**
   ```bash
   keytool -genkey -v -keystore verum-omnis-release.keystore \
     -alias verum-omnis -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Add GitHub Secrets:**
   - `KEYSTORE_BASE64`: Base64-encoded keystore file
     ```bash
     base64 -w 0 verum-omnis-release.keystore > keystore.txt
     # Copy content to GitHub secret
     ```
   - `KEYSTORE_PASSWORD`: Keystore password
   - `KEY_ALIAS`: Key alias (e.g., `verum-omnis`)
   - `KEY_PASSWORD`: Key password

3. **Update Workflow:** Modify `.github/workflows/build-apk.yml` to include release build steps with signing.

## Monitoring Builds

### View Build Status

- Go to GitHub repository → Actions tab
- Click on a workflow run to see details
- Download APK artifacts from successful builds

### Build Artifacts

Debug APKs are available as artifacts for 30 days:
1. Go to Actions → Select workflow run
2. Scroll to "Artifacts" section
3. Download `app-debug.apk`

## Troubleshooting

### Firebase Deployment Issues

**Error: "Project not found"**
- Verify `.firebaserc` contains correct project ID
- Check `FIREBASE_PROJECT_ID` secret matches

**Error: "Permission denied"**
- Regenerate `FIREBASE_SERVICE_ACCOUNT` secret
- Ensure service account has "Firebase Hosting Admin" role

### Android Build Issues

**Error: "Capacitor not found"**
- Run Capacitor setup steps above
- Commit generated files

**Error: "SDK not found"**
- GitHub Actions uses Java 17 automatically
- For local builds, ensure Android SDK is installed

**Error: "Build failed"**
- Check build logs in GitHub Actions
- Verify `package.json` build script works locally

## Environment Variables

### For Firebase Deployment

No environment variables needed for static hosting.

### For APK with API Keys

If your app requires API keys (like Gemini API):

1. **For GitHub Actions:**
   Add as repository secret and use in workflow:
   ```yaml
   - name: Build with API key
     run: npm run build
     env:
       VITE_API_KEY: ${{ secrets.GEMINI_API_KEY }}
   ```

2. **For Firebase:**
   Firebase Hosting doesn't support environment variables at runtime.
   Options:
   - Use Firebase Remote Config
   - Use Cloud Functions as proxy
   - Client-side key with restrictions

## Continuous Deployment Strategy

### Recommended Workflow

1. **Development:**
   - Work on feature branches
   - APK builds automatically on push
   - Download and test APKs

2. **Staging:**
   - Merge to `main`
   - Deploys to Firebase automatically
   - APK builds for release testing

3. **Production:**
   - Tag releases: `git tag v1.0.0`
   - Modify workflow to build signed APK on tags
   - Upload to Google Play Console

## Next Steps

1. ✅ Created Firebase configuration (`firebase.json`)
2. ✅ Created GitHub Actions workflows
3. ⏳ Set up Firebase project and add `.firebaserc`
4. ⏳ Add Firebase secrets to GitHub
5. ⏳ Initialize Capacitor (optional, for APK builds)
6. ⏳ Test deployment pipeline

## Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [APK Signing Guide](./CRYPTOGRAPHIC_SEALING_AND_APK_SIGNING.md)
