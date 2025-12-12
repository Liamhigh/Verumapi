# GitHub Actions Workflows

## deploy.yml - Deploy to Firebase and Build Android APK

This workflow handles automated deployment of the Verum Omnis application to Firebase Hosting and builds a signed Android APK.

### Trigger Conditions

The workflow runs automatically:
- **On push to `main` branch**: Automatically builds and deploys
- **Manual trigger**: Can be run manually from the Actions tab

### Workflow Jobs

#### 1. deploy-web
Deploys the web application to Firebase Hosting.

**Steps:**
1. Checkout repository
2. Setup Node.js 20
3. Install npm dependencies
4. Build web app with Vite
5. Deploy to Firebase Hosting (live channel)

**Required Secrets:**
- `FIREBASE_SERVICE_ACCOUNT_VERUM_OMNIS_V2`
- `OPENAI_API_KEY`

#### 2. build-android
Builds a signed Android APK (runs after web deployment).

**Steps:**
1. Checkout repository
2. Setup Node.js 20 and Java 17
3. Install npm dependencies
4. Build web app with Vite
5. Sync Capacitor to Android project
6. Decode keystore from base64 (if provided)
7. Create keystore.properties file
8. Build release APK with Gradle
9. Upload APK as workflow artifact
10. Create GitHub Release with APK

**Required Secrets:**
- `OPENAI_API_KEY`

**Optional Secrets (for signed APK):**
- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_PASSWORD`
- `ANDROID_KEY_ALIAS`

**Note:** If Android signing secrets are not provided, the workflow will attempt to build an unsigned APK.

### Outputs

1. **Web Deployment**: Live site on Firebase Hosting
2. **APK Artifact**: Available in the workflow run's artifacts section
3. **GitHub Release**: Created automatically with:
   - Tag format: `v{version}-{timestamp}`
   - Attached APK file
   - Release notes with commit information

### Manual Trigger

To manually run the workflow:

1. Go to the **Actions** tab in GitHub
2. Select **Deploy to Firebase and Build Android APK**
3. Click **Run workflow** button
4. Select the branch (usually `main`)
5. Click **Run workflow**

### Setup Requirements

Before the first run, ensure all required secrets are configured. See `/SECRETS.md` for detailed instructions.

**Minimum Required Secrets:**
- `FIREBASE_SERVICE_ACCOUNT_VERUM_OMNIS_V2` (for web deployment)
- `OPENAI_API_KEY` (for building the app)

**Additional Secrets for Signed Android APK:**
- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_PASSWORD`
- `ANDROID_KEY_ALIAS`

### Troubleshooting

**Web deployment fails:**
- Check that `FIREBASE_SERVICE_ACCOUNT_VERUM_OMNIS_V2` is valid JSON
- Verify Firebase Hosting is enabled for project `verum-omnis-v2`
- Ensure the service account has Hosting Admin role

**Android build fails:**
- Verify Java 17 is correctly set up (handled by workflow)
- Check that all keystore secrets are correctly set
- Review Gradle build logs in the workflow output
- If keystore secrets are missing, the build may fail or produce unsigned APK

**Release creation fails:**
- Ensure `GITHUB_TOKEN` has write permissions (default for workflows)
- Check that the repository allows workflow to create releases

### Monitoring

- View workflow runs in the **Actions** tab
- Download APK artifacts from completed workflow runs
- Check releases in the **Releases** section
- Review logs for any build or deployment errors

### Local Testing

To test the build process locally before pushing:

```bash
# Test web build
npm run build

# Test Android build (requires local keystore setup)
npm run android:build
```

See `/DEPLOYMENT.md` for detailed local setup instructions.
