# GitHub Secrets Configuration Guide

This document lists all the GitHub Secrets you need to configure for automated deployments.

## Required Secrets

### Firebase Hosting Secrets

1. **FIREBASE_SERVICE_ACCOUNT**
   - **Type**: JSON (multiline)
   - **How to get it**:
     1. Go to [Firebase Console](https://console.firebase.com/)
     2. Select your project
     3. Go to Project Settings → Service Accounts
     4. Click "Generate New Private Key"
     5. Copy the entire JSON file content
   - **Example format**:
     ```json
     {
       "type": "service_account",
       "project_id": "your-project-id",
       "private_key_id": "...",
       "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
       "client_email": "...",
       ...
     }
     ```

2. **FIREBASE_PROJECT_ID**
   - **Type**: String
   - **Example**: `verum-omnis-app`
   - **How to get it**: Found in your Firebase project settings URL or in the service account JSON

### Android Signing Secrets

3. **ANDROID_KEYSTORE_BASE64**
   - **Type**: String (base64 encoded)
   - **How to create**:
     ```bash
     # Generate keystore
     keytool -genkey -v -keystore release.keystore -alias upload -keyalg RSA -keysize 2048 -validity 10000
     
     # Convert to base64
     cat release.keystore | base64 -w 0 > release.keystore.base64
     
     # Use the content of release.keystore.base64 as the secret value
     ```

4. **ANDROID_KEYSTORE_PASSWORD**
   - **Type**: String
   - **Example**: `MySecurePassword123`
   - **Note**: The password you entered when creating the keystore

5. **ANDROID_KEY_PASSWORD**
   - **Type**: String  
   - **Example**: `MySecurePassword123`
   - **Note**: The key password (can be same as keystore password)

6. **ANDROID_KEY_ALIAS**
   - **Type**: String
   - **Example**: `upload`
   - **Note**: The alias you used when creating the keystore

### Application Secrets

7. **OPENAI_API_KEY**
   - **Type**: String
   - **Example**: `sk-proj-...`
   - **How to get it**: Get your API key from https://platform.openai.com/api-keys

## How to Add Secrets to GitHub

1. Go to your repository on GitHub
2. Click on **Settings**
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Enter the secret name (exactly as shown above)
6. Paste the secret value
7. Click **Add secret**
8. Repeat for all required secrets

## Verification Checklist

Before triggering the workflow, ensure:

- [ ] All 7 secrets are added to GitHub Actions
- [ ] FIREBASE_SERVICE_ACCOUNT is valid JSON
- [ ] FIREBASE_PROJECT_ID matches your Firebase project
- [ ] ANDROID_KEYSTORE_BASE64 is properly base64 encoded
- [ ] ANDROID_KEYSTORE_PASSWORD matches what you used to create the keystore
- [ ] ANDROID_KEY_PASSWORD matches what you used to create the keystore  
- [ ] ANDROID_KEY_ALIAS matches your keystore alias
- [ ] OPENAI_API_KEY is a valid API key

## Testing the Workflow

After adding all secrets:

1. Go to **Actions** tab in your repository
2. Select **Deploy to Firebase and Build Android APK** workflow
3. Click **Run workflow**
4. Select the branch (main or your current branch)
5. Click **Run workflow**

The workflow will:
- Build the web application
- Deploy to Firebase Hosting
- Build a signed Android APK
- Upload the APK as an artifact
- Create a GitHub release with the APK (if on main branch)

## Security Best Practices

- ✅ Never commit keystore files to git
- ✅ Never commit keystore passwords to git  
- ✅ Keep your Firebase service account JSON file secure
- ✅ Rotate API keys periodically
- ✅ Use different keystores for debug and release builds
- ✅ Back up your keystore file securely (if lost, you cannot update your app)

## Troubleshooting

### Firebase deployment fails
- Verify FIREBASE_SERVICE_ACCOUNT is valid JSON with no extra spaces
- Ensure Firebase Hosting is enabled for your project
- Check that FIREBASE_PROJECT_ID is correct

### Android build fails
- Verify all keystore secrets are set correctly
- Ensure the keystore was created with the correct alias
- Check that passwords match what was used during keystore creation

### Environment variables not working
- Ensure OPENAI_API_KEY is set in GitHub Secrets
- Verify the workflow file passes the environment variable correctly
