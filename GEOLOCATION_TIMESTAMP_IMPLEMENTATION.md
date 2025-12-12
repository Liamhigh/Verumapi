# Geolocation and Timestamp Implementation Guide

## Overview

This document describes the geolocation and timestamp features added to Verum Omnis for forensic audit trail purposes.

## Features Implemented

### 1. Timestamp Tracking

Every message in the chat now includes a precise ISO 8601 timestamp capturing the exact moment it was created.

**Implementation:**
- Timestamps are captured at message creation time in `App.tsx`
- Stored in ISO 8601 format (e.g., `2025-12-12T12:30:45.123Z`)
- Displayed in user-friendly format in the UI
- Included in PDF reports with timezone information

**Code Example:**
```typescript
const timestamp = new Date().toISOString();
const userMessage: Message = { 
  role: 'user', 
  text,
  timestamp,
  // ... other fields
};
```

### 2. Geolocation Tracking

Messages can include GPS coordinates for forensic documentation purposes.

**Implementation:**
- Uses Capacitor Geolocation plugin v8.0.0
- Requests user permission before capturing location
- Captures latitude, longitude, accuracy, and GPS timestamp
- Fails gracefully if permission denied or unavailable

**Platform Support:**
- ✅ Android: Full GPS support with permission prompts
- ⚠️ Web: Not supported (Capacitor limitation) - fails silently
- ✅ iOS: Would work if iOS build is added in the future

**Data Structure:**
```typescript
interface GeolocationData {
  latitude: number;    // Decimal degrees
  longitude: number;   // Decimal degrees
  accuracy: number;    // Meters
  timestamp: number;   // Unix timestamp
}
```

## User Experience

### In the Chat UI

Messages now display:
- 📅 Timestamp: Shows when the message was created
- 📍 Location: Clickable link to Google Maps (if available)

Example:
```
📅 Dec 12, 2024, 12:30 PM    📍 -33.9249, 18.4241
```

### In PDF Reports

The metadata section includes:
- **Generated:** Full timestamp with timezone
- **Location:** GPS coordinates with accuracy
- **Report ID:** First 16 characters of forensic seal
- **Seal Type:** SHA-512 Forensic Hash

## Privacy and Security

### User Consent
- Geolocation requires explicit user permission
- Users can deny permission - app works normally
- Permission can be revoked at any time in device settings

### Data Handling
- Geolocation is captured at the device level
- No data is sent to external servers
- All data stays in the user's chat session
- Cleared when user refreshes the page

### Security Scan Results
- ✅ CodeQL scan: 0 vulnerabilities
- ✅ No sensitive data leakage
- ✅ Proper permission handling

## Technical Details

### Dependencies Added

```json
{
  "@capacitor/geolocation": "^8.0.0"
}
```

### Android Permissions

Added to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-feature android:name="android.hardware.location.gps" />
```

### Service Functions

**geolocationService.ts** provides:
- `checkGeolocationPermissions()` - Check if permissions granted
- `requestGeolocationPermissions()` - Request permissions from user
- `getCurrentGeolocation()` - Get current GPS position
- `formatGeolocation()` - Format coordinates for display
- `getGoogleMapsLink()` - Generate Google Maps URL

## Usage Examples

### Capturing Geolocation

```typescript
import { getCurrentGeolocation } from './services/geolocationService';

const geolocation = await getCurrentGeolocation();
// Returns: { latitude: -33.9249, longitude: 18.4241, accuracy: 15, timestamp: 1702389045123 }
// Or null if denied/unavailable
```

### Displaying Location

```typescript
import { formatGeolocation, getGoogleMapsLink } from './services/geolocationService';

if (message.geolocation) {
  const formatted = formatGeolocation(message.geolocation);
  // Returns: "-33.924900, 18.424100 (±15m)"
  
  const link = getGoogleMapsLink(message.geolocation);
  // Returns: "https://www.google.com/maps?q=-33.9249,18.4241"
}
```

## Testing

### Local Development

1. Start dev server: `npm run dev`
2. Open in browser: http://localhost:3000
3. Send a message
4. Observe console logs for geolocation attempts
5. Note: Geolocation will fail on web (expected behavior)

### Android Testing

1. Build APK: `npm run android:build` (requires Node 22+)
2. Install on Android device
3. Send a message
4. Grant location permission when prompted
5. Verify location appears in message metadata

### Manual Testing Checklist

- [ ] Timestamps appear on all messages
- [ ] Timestamps are accurate
- [ ] Location permission is requested (Android only)
- [ ] Location appears if permission granted
- [ ] App works normally if permission denied
- [ ] PDF includes timestamp and location
- [ ] Google Maps link works correctly

## Troubleshooting

### Geolocation Not Working on Web
**Expected behavior.** Capacitor Geolocation plugin only works on native platforms (Android/iOS).

### Permission Denied
**Normal behavior.** Users can choose to deny location access. The app continues to work without location data.

### Timestamps in Wrong Timezone
Timestamps are stored in UTC (ISO 8601). They are converted to local timezone when displayed using `toLocaleString()`.

### Location Inaccurate
GPS accuracy depends on:
- Device quality
- Environment (indoor/outdoor)
- Satellite visibility
The accuracy value (in meters) is included in the metadata.

## Firebase Deployment

The GitHub Actions workflow automatically deploys to Firebase when changes are merged to `main`.

### Required Secrets
- `OPENAI_API_KEY` - Gemini API key for the AI service
- `FIREBASE_SERVICE_ACCOUNT_VERUM_OMNIS_V2` - Firebase service account

### Deployment Process
1. Push to main branch
2. GitHub Actions triggers
3. Installs dependencies
4. Builds application (with API key)
5. Deploys to Firebase Hosting
6. Live at: https://verum-omnis-v2.web.app (or configured domain)

### Verifying Deployment

After deployment:
1. Visit the live URL
2. Send a test message
3. Verify timestamp appears
4. Check PDF report includes metadata

## Future Enhancements

Potential improvements:
- [ ] Add location history tracking
- [ ] Include location in forensic seal calculation
- [ ] Add map view in chat interface
- [ ] Support for iOS platform
- [ ] Offline location caching
- [ ] Location-based analytics

## Support

For issues or questions:
1. Check console logs for error messages
2. Verify permissions in Android settings
3. Review this documentation
4. Open an issue on GitHub

## References

- [Capacitor Geolocation Plugin](https://capacitorjs.com/docs/apis/geolocation)
- [ISO 8601 Timestamp Format](https://en.wikipedia.org/wiki/ISO_8601)
- [Android Location Permissions](https://developer.android.com/training/location/permissions)
