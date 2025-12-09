# ⚠️ IMPORTANT: Required Configuration Before First Use

Before the GitHub Actions workflows can run successfully, you **MUST** complete these steps:

## 1. Update Firebase Project ID

Edit the file `.firebaserc` and replace the placeholder:

```json
{
  "projects": {
    "default": "your-actual-firebase-project-id-here"
  }
}
```

Get your project ID from Firebase Console → Project Settings → Project ID

## 2. Configure GitHub Secrets

Add all 7 required secrets in: **Settings → Secrets and variables → Actions**

See `SECRETS_SETUP.md` for the complete checklist.

## 3. Create Android Keystore

If you don't have a keystore, create one:

```bash
keytool -genkey -v -keystore release.keystore -alias release \
  -keyalg RSA -keysize 2048 -validity 10000
```

Then encode it for GitHub secrets:

```bash
base64 -i release.keystore | tr -d '\n' > keystore.txt
```

---

**Without these configurations, the workflows will fail.**

See `QUICKSTART.md` for detailed instructions.
