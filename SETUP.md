# Setup Instructions for GitHub Actions

This document explains how to set up the GitHub repository secrets required for automated builds and deployments.

## Required GitHub Secrets

### For Android APK Builds

1. **GEMINI_API_KEY**
   - Your Google Gemini API key
   - Get it from: https://aistudio.google.com/apikey
   - This is used to build the app with the API key embedded

2. **SIGNING_KEY_BASE64**
   - Base64 encoded Android keystore file
   - See "Generating Android Signing Key" section below

3. **KEY_ALIAS**
   - The alias name you used when creating the keystore
   - Example: `verum-omnis`

4. **KEY_STORE_PASSWORD**
   - The password for the keystore file

5. **KEY_PASSWORD**
   - The password for the key alias (often same as keystore password)

### For Firebase Deployment

1. **GEMINI_API_KEY**
   - Same as above

2. **FIREBASE_SERVICE_ACCOUNT**
   - Firebase service account JSON
   - Get from Firebase Console → Project Settings → Service Accounts
   - Generate new private key and copy the entire JSON content

3. **FIREBASE_PROJECT_ID**
   - Your Firebase project ID
   - Find in Firebase Console → Project Settings

## Generating Android Signing Key

### Step 1: Create a Keystore

Run this command (replace values as needed):

```bash
keytool -genkey -v -keystore verum-omnis.keystore \
  -alias verum-omnis \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

You'll be prompted for:
- Keystore password (remember this!)
- Key password (can be same as keystore password)
- Your name, organization, etc.

### Step 2: Convert Keystore to Base64

**On macOS:**
```bash
base64 -i verum-omnis.keystore | pbcopy
```

**On Linux:**
```bash
base64 -i verum-omnis.keystore | xclip
# or
base64 -i verum-omnis.keystore > keystore.base64.txt
```

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("verum-omnis.keystore")) | clip
```

### Step 3: Add Secrets to GitHub

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret:
   - Name: `SIGNING_KEY_BASE64`
   - Value: Paste the base64 encoded keystore
   - Click "Add secret"
5. Repeat for all other secrets

## Setting Up Firebase

### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Create a new project or select existing
3. Enable Firebase Hosting

### Step 2: Get Service Account

1. In Firebase Console, go to Project Settings (gear icon)
2. Click "Service Accounts" tab
3. Click "Generate New Private Key"
4. Save the JSON file securely
5. Copy the entire content and add to GitHub secret `FIREBASE_SERVICE_ACCOUNT`

### Step 3: Get Project ID

1. In Firebase Console → Project Settings
2. Copy the "Project ID"
3. Add to GitHub secret `FIREBASE_PROJECT_ID`

## Testing the Workflows

### Test Android Build

1. Push to main branch or manually trigger the workflow
2. Go to Actions tab in GitHub
3. Click on "Build Android APK" workflow
4. Monitor the build progress
5. Download the signed APK from artifacts or releases

### Test Firebase Deployment

1. Push to main branch or manually trigger the workflow
2. Go to Actions tab in GitHub
3. Click on "Deploy to Firebase Hosting" workflow
4. Monitor the deployment
5. Visit your Firebase Hosting URL to see the deployed app

## Security Best Practices

- ✅ Never commit the keystore file to the repository
- ✅ Never commit API keys to the repository
- ✅ Store the keystore file and passwords in a secure location (password manager)
- ✅ Use different keystores for development and production
- ✅ Rotate API keys periodically
- ✅ Use Firebase Security Rules to protect your backend

## Troubleshooting

### Build Fails with "Signing Failed"
- Verify all signing secrets are correctly set
- Ensure the base64 encoding is complete (no line breaks)
- Check that the alias and passwords match

### Firebase Deployment Fails
- Verify the service account JSON is valid
- Check that Firebase Hosting is enabled
- Ensure the project ID is correct

### API Key Not Working
- Verify the Gemini API key is valid
- Check API key has necessary permissions
- Ensure the key is for the correct Google Cloud project

## Need Help?

If you encounter issues:
1. Check the GitHub Actions logs for detailed error messages
2. Verify all secrets are correctly configured
3. Ensure you have the necessary permissions on Firebase
4. Review the Firebase and Capacitor documentation
