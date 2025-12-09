# Troubleshooting Guide

Common issues and solutions for Firebase deployment and Android APK builds.

## 🔥 Firebase Deployment Issues

### Issue: "Resource not accessible by integration"

**Symptom:** Firebase deploy workflow fails with permission error.

**Solution:**
1. Verify `GITHUB_TOKEN` has correct permissions (auto-provided, should work)
2. Check repository settings → Actions → General → Workflow permissions
3. Ensure "Read and write permissions" is selected

### Issue: "Invalid Firebase service account"

**Symptom:** Firebase deploy fails with authentication error.

**Solution:**
1. Regenerate service account key in Firebase Console
2. Copy the ENTIRE JSON content (including braces)
3. Update `FIREBASE_SERVICE_ACCOUNT` secret
4. Ensure no extra spaces or line breaks in the JSON

### Issue: "Project not found"

**Symptom:** Firebase deploy can't find the project.

**Solution:**
1. Verify `FIREBASE_PROJECT_ID` matches your Firebase Console
2. Update `.firebaserc` with correct project ID
3. Ensure Firebase Hosting is enabled in your project

### Issue: Build succeeds but deployment fails

**Symptom:** Build step passes, deploy step fails.

**Solution:**
1. Check Firebase Hosting is enabled
2. Verify billing is enabled (if using Firebase with paid features)
3. Check Firebase status page for outages
4. Review detailed error message in workflow logs

## 📱 Android Build Issues

### Issue: "Keystore not found"

**Symptom:** Build fails during signing step.

**Solution:**
1. Verify `ANDROID_KEYSTORE_BASE64` is properly base64 encoded
2. Re-encode keystore without line breaks:
   ```bash
   base64 -i release.keystore | tr -d '\n' > keystore.txt
   ```
3. Copy content and update secret

### Issue: "Password incorrect" or signing fails

**Symptom:** Build fails with password error.

**Solution:**
1. Verify `KEYSTORE_PASSWORD` and `KEY_PASSWORD` are correct
2. Check `KEY_ALIAS` matches the alias in your keystore
3. Test locally:
   ```bash
   keytool -list -v -keystore release.keystore -alias release
   ```

### Issue: Gradle build fails

**Symptom:** `./gradlew assembleRelease` fails.

**Solution:**
1. Check Java version is 17 (specified in workflow)
2. Ensure Capacitor initialized correctly
3. Review build.gradle modifications (see ANDROID_BUILD_CONFIG.md)
4. Check for Gradle sync issues in logs

### Issue: APK not found after build

**Symptom:** Upload artifact step can't find APK.

**Solution:**
1. Check if build actually succeeded
2. Verify output path: `android/app/build/outputs/apk/release/app-release.apk`
3. Check for build type mismatch (debug vs release)

### Issue: "Failed to install APK"

**Symptom:** APK downloads but won't install on device.

**Solution:**
1. Enable "Install from unknown sources" on Android device
2. Verify APK is properly signed:
   ```bash
   jarsigner -verify app-release.apk
   ```
3. Check APK isn't corrupted (re-download)
4. Ensure device Android version is compatible

### Issue: App crashes immediately after launch

**Symptom:** APK installs but crashes on startup.

**Solution:**
1. Check Android logs:
   ```bash
   adb logcat | grep -i verum
   ```
2. Verify Capacitor configuration in `capacitor.config.json`
3. Ensure web assets are properly bundled in APK
4. Check for missing permissions in AndroidManifest.xml

## 🔧 Workflow Issues

### Issue: "npm ci" fails

**Symptom:** Dependencies installation fails.

**Solution:**
1. Ensure `package-lock.json` is committed
2. Check for npm registry issues
3. Clear npm cache (for local testing):
   ```bash
   npm cache clean --force
   npm install
   ```

### Issue: Build works locally but fails in GitHub Actions

**Symptom:** Different results between local and CI.

**Solution:**
1. Check Node.js version matches (workflow uses v20)
2. Ensure environment variables are set in workflow
3. Check for OS-specific issues (Actions uses Ubuntu)
4. Review workflow logs for detailed error messages

### Issue: Secrets not available in workflow

**Symptom:** Environment variables are empty/undefined.

**Solution:**
1. Verify secrets are named exactly as in workflow file
2. Check secrets are set at repository level (not environment)
3. Confirm workflow file references secrets correctly:
   ```yaml
   env:
     KEY: ${{ secrets.SECRET_NAME }}
   ```

## 🌐 Network/Connectivity Issues

### Issue: "Unable to download dependencies"

**Symptom:** npm install or Gradle build fails with network error.

**Solution:**
1. Check GitHub Actions status page
2. Retry the workflow (network issue might be temporary)
3. Check npm or Maven central status

### Issue: Firebase deployment hangs

**Symptom:** Deploy step runs but never completes.

**Solution:**
1. Cancel and retry the workflow
2. Check Firebase status page
3. Review Firebase quota limits
4. Try deploying with a smaller build

## 🔒 Security Issues

### Issue: "Exposed secret in logs"

**Symptom:** Workflow logs show sensitive data.

**Solution:**
1. Rotate all affected secrets immediately
2. Review workflow file to ensure secrets aren't echoed
3. Use `::add-mask::` to mask sensitive values if needed
4. Delete workflow run logs if possible

### Issue: Keystore committed to repository

**Symptom:** Keystore file appears in git history.

**Solution:**
1. Generate new keystore immediately
2. Use BFG Repo Cleaner or git filter-branch to remove from history
3. Update all secrets with new keystore
4. Force push cleaned history (coordinate with team)

## 📊 Validation Issues

### Issue: YAML syntax error

**Symptom:** Workflow file has syntax errors.

**Solution:**
1. Use online YAML validator
2. Check indentation (use spaces, not tabs)
3. Validate locally:
   ```bash
   yamllint .github/workflows/*.yml
   ```

### Issue: Action not found

**Symptom:** Workflow references non-existent action.

**Solution:**
1. Check action name and version are correct
2. Ensure GitHub Actions marketplace is accessible
3. Try updating action to latest version (@v4, @v0, etc.)

## 🎯 Performance Issues

### Issue: Workflow takes too long

**Symptom:** Build times are excessive.

**Solution:**
1. Enable npm caching (already configured)
2. Use `npm ci` instead of `npm install` (already configured)
3. Consider splitting workflows
4. Review build optimization opportunities

### Issue: Large APK size

**Symptom:** APK is larger than expected.

**Solution:**
1. Review bundled assets in dist/
2. Consider code splitting
3. Optimize images and resources
4. Use ProGuard/R8 for release builds (in build.gradle)

## 📞 Getting Help

If issues persist:

1. **Check GitHub Actions logs:** Detailed error messages in workflow runs
2. **Review Firebase Console:** Check deployment history and errors
3. **Test locally:** Try reproducing the issue on your machine
4. **Check documentation:**
   - [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
   - [SECRETS_SETUP.md](SECRETS_SETUP.md)
   - [ANDROID_BUILD_CONFIG.md](ANDROID_BUILD_CONFIG.md)
5. **Validate setup:** Use [VALIDATION_CHECKLIST.md](VALIDATION_CHECKLIST.md)

## 🔍 Debug Mode

Enable verbose logging in workflows:

```yaml
# Add to any step
- name: Debug step
  run: |
    set -x  # Enable debug output
    your-command
```

## 📝 Useful Commands

```bash
# Check workflow syntax locally
yamllint .github/workflows/*.yml

# Test build locally
npm run build

# Verify APK signature
jarsigner -verify -verbose -certs app-release.apk

# Check Android device logs
adb logcat | grep -i verum

# List keystore contents
keytool -list -v -keystore release.keystore

# Verify Firebase CLI setup
firebase projects:list

# Test Capacitor sync
npx cap sync android
```
