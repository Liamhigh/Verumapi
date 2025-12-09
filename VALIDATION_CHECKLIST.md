# Pre-Flight Validation Checklist

Use this checklist to validate your deployment setup before going live.

## ✅ Repository Setup

- [ ] All workflow files are present in `.github/workflows/`
  - [ ] `firebase-deploy.yml`
  - [ ] `android-build.yml`

- [ ] Configuration files are present
  - [ ] `firebase.json`
  - [ ] `.firebaserc` (with your project ID)
  - [ ] `capacitor.config.json`
  - [ ] `.env.local.example`

- [ ] `.gitignore` updated to exclude:
  - [ ] `android/` directory
  - [ ] `*.keystore` files
  - [ ] `.firebase/` directory
  - [ ] `.env.local` file

## ✅ GitHub Secrets

Verify all 7 secrets are configured (Settings → Secrets and variables → Actions):

**Firebase:**
- [ ] `FIREBASE_SERVICE_ACCOUNT` (JSON format)
- [ ] `FIREBASE_PROJECT_ID` (project-id-12345)
- [ ] `OPENAI_API_KEY` (API key string starting with sk-)

**Android:**
- [ ] `ANDROID_KEYSTORE_BASE64` (base64 encoded keystore)
- [ ] `KEYSTORE_PASSWORD` (password string)
- [ ] `KEY_ALIAS` (usually "release")
- [ ] `KEY_PASSWORD` (password string)

## ✅ Firebase Project

- [ ] Firebase project created at console.firebase.google.com
- [ ] Firebase Hosting enabled
- [ ] Service account key generated and downloaded
- [ ] Project ID updated in `.firebaserc`

## ✅ Android Keystore

- [ ] Keystore file generated (`release.keystore`)
- [ ] Keystore backed up securely (password manager, encrypted backup)
- [ ] Keystore passwords documented (in secure location, NOT in repository)
- [ ] Keystore base64 encoded without line breaks
- [ ] Key alias matches the one in secrets (`release`)

## ✅ Local Testing

- [ ] `npm install` runs without errors
- [ ] `npm run build` completes successfully
- [ ] Build output in `dist/` directory exists
- [ ] `dist/index.html` is present
- [ ] `npm run dev` starts development server
- [ ] Application loads at http://localhost:3000

## ✅ Workflow Validation

**Firebase Deploy Workflow:**
- [ ] YAML syntax is valid (use yamllint or online validator)
- [ ] Node.js version matches your local version (20)
- [ ] Build command is correct (`npm run build`)
- [ ] Firebase action version is up to date (`FirebaseExtended/action-hosting-deploy@v0`)

**Android Build Workflow:**
- [ ] YAML syntax is valid
- [ ] Java version is 17 (required for Android builds)
- [ ] Capacitor init command uses correct app ID (`com.verumomnis.app`)
- [ ] Gradle wrapper has execute permissions (`chmod +x gradlew`)
- [ ] APK output path is correct

## ✅ First Deployment Test

**Firebase:**
1. [ ] Push code to `main` branch
2. [ ] Check GitHub Actions tab for workflow run
3. [ ] Workflow completes successfully (green checkmark)
4. [ ] Visit Firebase Hosting URL (check Firebase Console)
5. [ ] Application loads and functions correctly
6. [ ] Check browser console for errors

**Android (Debug):**
1. [ ] Create a pull request
2. [ ] Check GitHub Actions tab for workflow run
3. [ ] Workflow completes successfully
4. [ ] Download APK from workflow artifacts
5. [ ] Install APK on Android device/emulator
6. [ ] App launches without crashes

**Android (Release):**
1. [ ] Push to `main` or create tag `v1.0.0`
2. [ ] Check GitHub Actions tab for workflow run
3. [ ] Workflow completes successfully
4. [ ] Download signed APK from artifacts or release
5. [ ] Verify APK signature: `jarsigner -verify -verbose -certs app-release.apk`
6. [ ] Install on device and test

## 🔒 Security Validation

- [ ] No secrets committed to repository (`git log --all --full-history --source -- *keystore* *password* *secret*`)
- [ ] `.gitignore` properly excludes sensitive files
- [ ] `.env.local` is in `.gitignore` and not tracked
- [ ] GitHub secrets are not logged in workflow output
- [ ] Keystore file is backed up in secure location
- [ ] Service account JSON is not in repository

## 📱 Android Signing Verification

After building release APK:

```bash
# Verify APK is signed
jarsigner -verify -verbose -certs android/app/build/outputs/apk/release/app-release.apk

# Should see: "jar verified"

# Check APK details
aapt dump badging android/app/build/outputs/apk/release/app-release.apk | grep package

# Should show: package: name='com.verumomnis.app'
```

## 🚨 Common Issues

**Build fails with "No secret named..."**
→ Check that all 7 secrets are configured in GitHub

**Firebase deploy fails with "Invalid service account"**
→ Verify JSON format is correct and complete

**Android build fails with "Keystore not found"**
→ Check base64 encoding has no line breaks

**APK install fails with "Parse error"**
→ Verify APK is properly signed and not corrupted

**App crashes on launch**
→ Check Android logs: `adb logcat | grep -i verum`

## ✅ Production Readiness

Before sharing with users:

- [ ] All tests pass
- [ ] Firebase deployment successful
- [ ] Android APK installs and runs
- [ ] App functionality verified on both platforms
- [ ] Error handling tested
- [ ] Environment variables properly configured
- [ ] Documentation reviewed and updated
- [ ] Keystore securely backed up
- [ ] Team members have access to secrets (secure location)

## 📊 Post-Deployment Monitoring

After going live:

- [ ] Monitor GitHub Actions for failed deployments
- [ ] Check Firebase Console for hosting metrics
- [ ] Monitor application errors (Firebase Crashlytics optional)
- [ ] Set up alerts for workflow failures
- [ ] Document any issues and resolutions

---

**Status:**
- [ ] All checks passed
- [ ] Ready for production deployment
- [ ] Team notified of deployment procedures

**Date Validated:** _____________

**Validated By:** _____________
