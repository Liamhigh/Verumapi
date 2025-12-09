# GitHub Secrets Setup Checklist

Before the GitHub Actions workflows can run successfully, you must configure the following secrets in your repository.

Go to: **Settings → Secrets and variables → Actions → New repository secret**

## Required Secrets

### Firebase Hosting Deployment

- [ ] **FIREBASE_SERVICE_ACCOUNT**
  - Content: Full JSON from Firebase service account key
  - How to get: Firebase Console → Project Settings → Service Accounts → Generate New Private Key
  - Format: Paste the entire JSON content as-is

- [ ] **FIREBASE_PROJECT_ID**  
  - Content: Your Firebase project ID (e.g., `my-app-12345`)
  - How to get: Firebase Console → Project Settings → Project ID
  - Format: Plain text project ID

### Application Configuration

- [ ] **GEMINI_API_KEY**
  - Content: Your Google Gemini API key
  - How to get: https://ai.google.dev/
  - Format: Plain text API key

### Android APK Signing

- [ ] **ANDROID_KEYSTORE_BASE64**
  - Content: Base64 encoded keystore file
  - How to create keystore:
    ```bash
    keytool -genkey -v -keystore release.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000
    ```
  - How to encode:
    ```bash
    base64 -i release.keystore | tr -d '\n' > keystore.base64.txt
    ```
  - Format: Single line base64 string (copy from keystore.base64.txt)

- [ ] **KEYSTORE_PASSWORD**
  - Content: Password you set when creating the keystore
  - Format: Plain text password

- [ ] **KEY_ALIAS**
  - Content: The alias name (usually "release")
  - Format: Plain text alias name

- [ ] **KEY_PASSWORD**
  - Content: Password for the key alias (usually same as keystore password)
  - Format: Plain text password

## Verification Steps

After adding all secrets:

1. Check that all 7 secrets are listed in Settings → Secrets and variables → Actions
2. Trigger a workflow run from the Actions tab
3. Check workflow logs for any secret-related errors

## Security Notes

⚠️ **IMPORTANT:**
- Never commit secrets to your repository
- Keep your keystore file and passwords safe
- If you lose your keystore, you cannot update your published app
- Store keystore backup in a secure location (password manager, encrypted backup)

## Optional: Update Firebase Project ID in .firebaserc

Edit `.firebaserc` and replace `your-firebase-project-id` with your actual project ID:

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

Commit this change to your repository.
