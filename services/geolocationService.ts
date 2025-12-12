import { Geolocation } from '@capacitor/geolocation';

export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

/**
 * Checks if geolocation permissions are granted
 */
export async function checkGeolocationPermissions(): Promise<boolean> {
  try {
    const permission = await Geolocation.checkPermissions();
    return permission.location === 'granted' || permission.coarseLocation === 'granted';
  } catch (error) {
    console.error('Error checking geolocation permissions:', error);
    return false;
  }
}

/**
 * Requests geolocation permissions from the user
 */
export async function requestGeolocationPermissions(): Promise<boolean> {
  try {
    const permission = await Geolocation.requestPermissions();
    return permission.location === 'granted' || permission.coarseLocation === 'granted';
  } catch (error) {
    console.error('Error requesting geolocation permissions:', error);
    return false;
  }
}

/**
 * Gets the current geolocation. Returns null if permission denied or error occurs.
 */
export async function getCurrentGeolocation(): Promise<GeolocationData | null> {
  try {
    // Check if we have permissions
    const hasPermission = await checkGeolocationPermissions();
    
    if (!hasPermission) {
      // Request permissions
      const granted = await requestGeolocationPermissions();
      if (!granted) {
        console.log('Geolocation permission denied by user');
        return null;
      }
    }

    // Get current position
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp
    };
  } catch (error) {
    // Geolocation may not be available on web or permission denied
    console.log('Geolocation not available:', error);
    return null;
  }
}

/**
 * Formats geolocation data for display
 */
export function formatGeolocation(geo: GeolocationData): string {
  return `${geo.latitude.toFixed(6)}, ${geo.longitude.toFixed(6)} (±${geo.accuracy.toFixed(0)}m)`;
}

/**
 * Generates a Google Maps link for the geolocation
 */
export function getGoogleMapsLink(geo: GeolocationData): string {
  return `https://www.google.com/maps?q=${geo.latitude},${geo.longitude}`;
}
