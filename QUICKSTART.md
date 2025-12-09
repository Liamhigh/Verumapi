# Quick Start Guide for Deployment

This repository is now configured for automated deployment! Here's what you need to do to get started.

## ⚡ Quick Steps

### 1. Set Up GitHub Secrets (5 minutes)

Follow the checklist in [SECRETS_SETUP.md](SECRETS_SETUP.md) to add these 7 secrets:

**Firebase (3 secrets):**
- `FIREBASE_SERVICE_ACCOUNT`
- `FIREBASE_PROJECT_ID`
- `OPENAI_API_KEY`

**Android Signing (4 secrets):**
- `ANDROID_KEYSTORE_BASE64`
- `KEYSTORE_PASSWORD`
- `KEY_ALIAS`
- `KEY_PASSWORD`

### 2. Update Firebase Project ID (1 minute)

Edit `.firebaserc` and replace `your-firebase-project-id` with your actual Firebase project ID.

### 3. Test the Workflows

After setting up secrets:

**Test Firebase Deployment:**
1. Push a change to the `main` branch
2. Go to Actions tab → "Deploy to Firebase Hosting"
3. Your app should be live at `https://your-project-id.web.app`

**Test Android Build:**
1. Create a tag: `git tag v1.0.0 && git push origin v1.0.0`
2. Go to Actions tab → "Build Android APK"
3. Download the APK from the workflow artifacts or Releases page

## 📋 What's Included

✅ **Firebase Hosting Deployment**
- Automatic deployment on push to main
- Preview deployments for pull requests

✅ **Android APK Build**
- Signed release APKs on main branch pushes
- Debug APKs for pull requests
- Automatic GitHub releases for version tags

✅ **Documentation**
- Complete setup guides in DEPLOYMENT_GUIDE.md
- Android build configuration in ANDROID_BUILD_CONFIG.md
- Secrets checklist in SECRETS_SETUP.md

## 🆘 Need Help?

1. **Workflows failing?** Check the detailed guides:
   - [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Comprehensive setup
   - [SECRETS_SETUP.md](SECRETS_SETUP.md) - Secrets configuration
   - [ANDROID_BUILD_CONFIG.md](ANDROID_BUILD_CONFIG.md) - Android specifics

2. **Security concerns?** All sensitive data is stored in GitHub Secrets (encrypted)

3. **Want to customize?** Edit the workflow files in `.github/workflows/`

## 🎯 Next Steps

After successful deployment:

1. Share your Firebase URL with users
2. Distribute the Android APK to testers
3. Set up custom domains in Firebase (optional)
4. Configure Firebase Analytics (optional)
5. Set up Crashlytics for Android (optional)

---

**Note:** If you don't need Android APK builds, you can safely delete or disable the `android-build.yml` workflow. The Firebase deployment works independently.
