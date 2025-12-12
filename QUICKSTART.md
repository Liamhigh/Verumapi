# Quick Start: GitHub Actions Deployment

This guide will help you get the deployment workflow running quickly.

## What's Been Set Up

✅ **GitHub Actions Workflow**: `.github/workflows/deploy.yml`
- Deploys web app to Firebase Hosting
- Builds signed Android APK
- Creates GitHub releases automatically
- Can be triggered manually or on push to `main`

✅ **Documentation**:
- `.github/workflows/README.md` - Detailed workflow documentation
- `SECRETS.md` - Complete secrets configuration guide
- `DEPLOYMENT.md` - Full deployment setup guide

## Next Steps

### 1. Configure Required Secrets

At minimum, you need these 2 secrets to run the workflow:

1. **FIREBASE_SERVICE_ACCOUNT_VERUM_OMNIS_V2**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select project "verum-omnis-v2"
   - Project Settings → Service Accounts
   - Generate New Private Key
   - Copy the entire JSON content

2. **OPENAI_API_KEY**
   - Your Gemini API key (despite the name)
   - Get from Google AI Studio

**To add secrets:**
- Go to your repo on GitHub
- Settings → Secrets and variables → Actions
- New repository secret
- Add each secret

### 2. (Optional) Configure Android Signing

For signed Android APKs, add these 4 additional secrets:

- `ANDROID_KEYSTORE_BASE64` - Your keystore encoded in base64
- `ANDROID_KEYSTORE_PASSWORD` - Keystore password
- `ANDROID_KEY_PASSWORD` - Key password
- `ANDROID_KEY_ALIAS` - Key alias (default: "upload")

See `SECRETS.md` for detailed instructions on creating and encoding the keystore.

**Note**: If you skip this step, the workflow will build an unsigned APK.

### 3. Test the Workflow

#### Option A: Manual Test
1. Go to **Actions** tab in GitHub
2. Select "Deploy to Firebase and Build Android APK"
3. Click **Run workflow**
4. Select branch (e.g., `main`)
5. Click **Run workflow**

#### Option B: Push to Main
Push any commit to the `main` branch and the workflow will run automatically.

### 4. Monitor the Build

1. Go to **Actions** tab
2. Click on the running workflow
3. Watch the progress of both jobs:
   - `deploy-web` - Firebase deployment
   - `build-android` - Android APK build

### 5. Get Your Artifacts

After successful build:

**Web App**: 
- Automatically deployed to Firebase Hosting
- URL: Check your Firebase console for the hosting URL

**Android APK**:
- **Download from Artifacts**: Click on the workflow run → Scroll to "Artifacts" section → Download "app-release"
- **Download from Releases**: Go to "Releases" section in GitHub → Latest release → Download APK file

## Troubleshooting

### Web deployment fails
- Verify `FIREBASE_SERVICE_ACCOUNT_VERUM_OMNIS_V2` is valid JSON
- Check Firebase Hosting is enabled for your project

### Android build fails
- If keystore secrets are set, verify they're correct
- Check the Gradle build logs in the workflow output
- Try without keystore secrets first (unsigned build)

### No release created
- Releases are only created on successful Android builds
- Check that workflow has permission to create releases

## What Happens on Each Run

1. **Web Deployment** (3-5 minutes):
   - Installs dependencies
   - Builds the React app with Vite
   - Deploys to Firebase Hosting

2. **Android Build** (5-10 minutes):
   - Sets up Java 17 and Gradle
   - Builds the web app
   - Syncs with Capacitor
   - Decodes keystore (if provided)
   - Builds APK with Gradle
   - Uploads APK as artifact
   - Creates GitHub release

## Need More Help?

- **Workflow details**: See `.github/workflows/README.md`
- **Secrets setup**: See `SECRETS.md`
- **Local deployment**: See `DEPLOYMENT.md`
- **General info**: See `README.md`

## Success Indicators

✅ Workflow runs without errors
✅ Web app is accessible at Firebase URL
✅ APK artifact is available for download
✅ GitHub release is created with APK attached
✅ APK installs and runs on Android device
