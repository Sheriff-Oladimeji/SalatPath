import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';

/**
 * Qibla compass utility functions for SalatPath app
 */

// Coordinates of the Kaaba in Mecca
const KAABA_LATITUDE = 21.4225;
const KAABA_LONGITUDE = 39.8262;

// Request location permissions
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

// Get current location
export const getCurrentLocation = async (): Promise<Location.LocationObject | null> => {
  try {
    const hasPermission = await requestLocationPermission();
    
    if (!hasPermission) {
      console.log('Location permission not granted');
      return null;
    }
    
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    
    return location;
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
};

// Calculate Qibla direction in degrees
export const calculateQiblaDirection = (
  latitude: number,
  longitude: number
): number => {
  // Convert degrees to radians
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const toDegrees = (radians: number) => (radians * 180) / Math.PI;
  
  // Convert coordinates to radians
  const lat1 = toRadians(latitude);
  const lon1 = toRadians(longitude);
  const lat2 = toRadians(KAABA_LATITUDE);
  const lon2 = toRadians(KAABA_LONGITUDE);
  
  // Calculate the Qibla direction using the spherical law of cosines
  const y = Math.sin(lon2 - lon1);
  const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(lon2 - lon1);
  
  // Calculate the angle in degrees
  let qiblaAngle = toDegrees(Math.atan2(y, x));
  
  // Normalize to 0-360 degrees
  qiblaAngle = (qiblaAngle + 360) % 360;
  
  return qiblaAngle;
};

// Start magnetometer subscription
export const startMagnetometer = (
  callback: (data: { x: number; y: number; z: number }) => void
): { unsubscribe: () => void } => {
  const subscription = Magnetometer.addListener(callback);
  
  // Set update interval (in milliseconds)
  Magnetometer.setUpdateInterval(100);
  
  return {
    unsubscribe: () => {
      subscription.remove();
    },
  };
};

// Calculate device heading from magnetometer data
export const calculateHeading = (
  magnetometerData: { x: number; y: number; z: number }
): number => {
  const { x, y } = magnetometerData;
  
  // Calculate the angle in degrees
  let heading = Math.atan2(y, x) * (180 / Math.PI);
  
  // Normalize to 0-360 degrees
  heading = (heading + 360) % 360;
  
  return heading;
};

// Calculate the angle to point the device for Qibla
export const calculateQiblaAngle = (
  deviceHeading: number,
  qiblaDirection: number
): number => {
  // Calculate the difference between the device heading and Qibla direction
  let angle = qiblaDirection - deviceHeading;
  
  // Normalize to -180 to 180 degrees
  if (angle > 180) {
    angle -= 360;
  } else if (angle < -180) {
    angle += 360;
  }
  
  return angle;
};
