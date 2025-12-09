# Android Build Configuration

When Capacitor generates the Android project, you need to configure signing for release builds.

## Automatic Configuration via key.properties

The GitHub Actions workflow automatically creates a `key.properties` file during the build.
You need to ensure your `android/app/build.gradle` file is configured to use it.

## Required Changes to android/app/build.gradle

After running `npx cap add android`, add the following to `android/app/build.gradle`:

### 1. Load the keystore properties (add at the top of the file, after plugins):

```gradle
def keystorePropertiesFile = rootProject.file("key.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

### 2. Configure signing in the android block:

```gradle
android {
    ...
    
    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
            }
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
    ...
}
```

## Alternative: Manual Local Setup

For local development and testing:

1. Create `android/key.properties`:
```
storePassword=your_keystore_password
keyPassword=your_key_password
keyAlias=release
storeFile=release.keystore
```

2. Place your `release.keystore` file in the `android/app/` directory

3. Build with: `cd android && ./gradlew assembleRelease`

**Note:** Never commit `key.properties` or keystore files to git. They are already in `.gitignore`.

## Verification

To verify your APK is properly signed:

```bash
# Check APK signature
jarsigner -verify -verbose -certs android/app/build/outputs/apk/release/app-release.apk

# View APK info
aapt dump badging android/app/build/outputs/apk/release/app-release.apk
```
