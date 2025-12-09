# Cryptographic PDF Sealing and APK Signing Guide

## PDF Cryptographic Sealing

### Implementation Details

The PDF generation has been enhanced with comprehensive cryptographic sealing to ensure forensic integrity:

#### 1. Multi-Layer Seal Structure

**Content Seal (SHA-512)**
- Hash of the AI response text
- Generated when message is created
- Displayed in chat interface

**PDF Seal (SHA-512)**
- Comprehensive hash of all metadata
- Includes:
  - Original content and content seal
  - Timestamp (ISO 8601)
  - Geolocation data (coordinates, accuracy, timezone)
  - PDF generation timestamp
- Generated at PDF creation time

#### 2. Verification Page

Each PDF includes a final verification page with:
- Complete Content Seal (SHA-512) - 128 hex characters
- Complete PDF Seal (SHA-512) - 128 hex characters
- Timestamp information
- Location coordinates and accuracy
- QR code on footer pages for quick verification

#### 3. PDF Metadata

Standard PDF properties set for authenticity:
```javascript
{
  title: 'Verum Omnis Forensic Report',
  subject: 'Cryptographically Sealed Forensic Analysis',
  author: 'Verum Omnis AI',
  keywords: 'forensic, sealed, cryptographic',
  creator: 'Verum Omnis v5.2.7'
}
```

### Capacitor Compatibility

The PDF generation is compatible with both browser and Capacitor (mobile):

**Browser Mode:**
- Uses standard `jsPDF.save()` method
- Downloads directly to browser downloads folder

**Capacitor Mode:**
- Detects Capacitor environment via `window.Capacitor`
- Generates PDF as Blob
- Creates temporary URL for download
- Properly cleans up URL after download
- Compatible with iOS and Android file systems

**Settings for Capacitor:**
```javascript
html2canvas(source, {
  scale: 2,
  backgroundColor: '#0A192F',
  useCORS: true,
  allowTaint: true,        // Enables cross-origin images
  logging: false,          // Reduces console noise
  windowWidth: source.scrollWidth,
  windowHeight: source.scrollHeight,
})
```

### Verification Process

1. **QR Code Verification**
   - Each page footer contains QR code with PDF seal
   - Can be scanned to retrieve seal hash
   - Compare with seal on verification page

2. **Hash Verification**
   - Content Seal verifies AI response integrity
   - PDF Seal verifies complete document integrity
   - Any modification invalidates the seal

3. **Metadata Verification**
   - Timestamp proves when report was generated
   - Geolocation proves where it was generated
   - All data included in PDF seal calculation

---

## APK Signing for Android (Capacitor)

### Prerequisites

1. **Android Studio** with SDK tools
2. **Java JDK** (8 or higher)
3. **Capacitor CLI** installed
4. **Keystore** for signing

### Step 1: Generate Signing Key

Create a keystore (one-time setup):

```bash
keytool -genkey -v -keystore verum-omnis-release.keystore \
  -alias verum-omnis \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**Important Information to Provide:**
- Password: Choose a strong password (store securely!)
- First and Last Name: Your organization name
- Organizational Unit: Your team/department
- Organization: Company/Organization name
- City/Locality: Your city
- State/Province: Your state
- Country Code: Two-letter country code (e.g., US, ZA, AE)

**Keep the keystore file and password EXTREMELY SECURE:**
- Store in password manager
- Backup to secure location
- Never commit to version control
- If lost, you cannot update your app in stores!

### Step 2: Configure Gradle for Signing

Edit `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('../../verum-omnis-release.keystore')
            storePassword 'YOUR_KEYSTORE_PASSWORD'
            keyAlias 'verum-omnis'
            keyPassword 'YOUR_KEY_PASSWORD'
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

**Security Best Practice:**
Don't hardcode passwords! Use environment variables or gradle.properties:

Create `android/gradle.properties`:
```properties
VERUM_RELEASE_STORE_FILE=../../verum-omnis-release.keystore
VERUM_RELEASE_STORE_PASSWORD=your_password_here
VERUM_RELEASE_KEY_ALIAS=verum-omnis
VERUM_RELEASE_KEY_PASSWORD=your_password_here
```

Then reference in build.gradle:
```gradle
signingConfigs {
    release {
        storeFile file(VERUM_RELEASE_STORE_FILE)
        storePassword VERUM_RELEASE_STORE_PASSWORD
        keyAlias VERUM_RELEASE_KEY_ALIAS
        keyPassword VERUM_RELEASE_KEY_PASSWORD
    }
}
```

### Step 3: Build Signed APK

**For Capacitor App:**

1. Build the web app:
```bash
npm run build
```

2. Sync with Capacitor:
```bash
npx cap sync android
```

3. Build signed APK:
```bash
cd android
./gradlew assembleRelease
```

Signed APK location:
```
android/app/build/outputs/apk/release/app-release.apk
```

**For AAB (Android App Bundle - Google Play):**
```bash
./gradlew bundleRelease
```

Bundle location:
```
android/app/build/outputs/bundle/release/app-release.aab
```

### Step 4: Verify APK Signature

```bash
# Using apksigner (recommended)
apksigner verify --verbose app-release.apk

# Using jarsigner
jarsigner -verify -verbose -certs app-release.apk
```

### Step 5: Upload to Google Play Console

1. **Create App in Play Console**
   - Go to https://play.google.com/console
   - Create new application
   - Fill in app details

2. **Upload Signed Bundle**
   - Navigate to Release > Production
   - Create new release
   - Upload `app-release.aab`
   - Complete store listing

3. **App Signing by Google Play**
   - Google Play re-signs with their key
   - Provides additional security
   - Recommended for new apps

### Security Recommendations

1. **Keystore Security**
   - Never commit keystore to version control
   - Use `.gitignore` to exclude:
     ```
     *.keystore
     *.jks
     gradle.properties
     ```
   - Store backups in secure vault (e.g., 1Password, LastPass)
   - Document location and access procedures

2. **Password Management**
   - Use strong, unique passwords
   - Different password for keystore and key
   - Store in enterprise password manager
   - Never share via email/chat

3. **Access Control**
   - Limit who can access keystore
   - Use CI/CD secrets for automated builds
   - Rotate keys if compromised

4. **Backup Strategy**
   - Multiple secure backup locations
   - Test restore procedure
   - Document recovery process

### CI/CD Integration

**GitHub Actions Example:**

```yaml
name: Build Android Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build web app
        run: npm run build
      
      - name: Sync Capacitor
        run: npx cap sync android
      
      - name: Decode keystore
        run: echo "${{ secrets.KEYSTORE_BASE64 }}" | base64 -d > verum-omnis-release.keystore
      
      - name: Build signed AAB
        run: |
          cd android
          ./gradlew bundleRelease \
            -PVERUM_RELEASE_STORE_FILE=../verum-omnis-release.keystore \
            -PVERUM_RELEASE_STORE_PASSWORD=${{ secrets.KEYSTORE_PASSWORD }} \
            -PVERUM_RELEASE_KEY_ALIAS=verum-omnis \
            -PVERUM_RELEASE_KEY_PASSWORD=${{ secrets.KEY_PASSWORD }}
      
      - name: Upload artifact
        uses: actions/upload-artifact@v2
        with:
          name: app-release
          path: android/app/build/outputs/bundle/release/app-release.aab
```

### Troubleshooting

**"Failed to read key from keystore"**
- Check keystore path is correct
- Verify passwords match
- Ensure alias name is correct

**"SHA1 mismatch"**
- Keystore may be corrupted
- Wrong keystore being used
- Restore from backup

**"Cannot update app in Play Store"**
- Must use same keystore as original upload
- If lost, must create new app listing
- This is why backups are critical!

### Additional Resources

- [Android Signing Documentation](https://developer.android.com/studio/publish/app-signing)
- [Capacitor Android Guide](https://capacitorjs.com/docs/android)
- [Google Play Signing](https://support.google.com/googleplay/android-developer/answer/9842756)

---

## Summary

### PDF Cryptographic Sealing ✓
- **Dual-layer SHA-512 hashing** (content + metadata)
- **QR code verification** on each page
- **Full verification page** with all seals and metadata
- **Capacitor compatible** with platform detection
- **Error handling** with user feedback

### APK Signing Process
1. Generate keystore with keytool
2. Configure build.gradle with signing config
3. Build with `./gradlew assembleRelease`
4. Verify with apksigner
5. Upload to Google Play Console

### Security Best Practices
- Secure keystore storage and backup
- Use environment variables for passwords
- Never commit credentials to version control
- Implement CI/CD with secrets management
- Regular security audits
