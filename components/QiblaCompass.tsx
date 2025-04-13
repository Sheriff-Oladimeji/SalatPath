import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { 
  calculateQiblaDirection, 
  calculateHeading, 
  calculateQiblaAngle, 
  getCurrentLocation,
  startMagnetometer
} from '../src/utils/qibla';

const QiblaCompass: React.FC = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [qiblaAngle, setQiblaAngle] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let magnetometerSubscription: { unsubscribe: () => void } | null = null;

    const initializeCompass = async () => {
      try {
        // Get current location
        const currentLocation = await getCurrentLocation();
        
        if (!currentLocation) {
          setErrorMessage('Unable to get your location. Please enable location services.');
          return;
        }
        
        const { latitude, longitude } = currentLocation.coords;
        setLocation({ latitude, longitude });
        
        // Calculate Qibla direction
        const direction = calculateQiblaDirection(latitude, longitude);
        setQiblaDirection(direction);
        
        // Start magnetometer to get device heading
        magnetometerSubscription = startMagnetometer((data) => {
          const heading = calculateHeading(data);
          setDeviceHeading(heading);
          
          if (qiblaDirection !== null) {
            const angle = calculateQiblaAngle(heading, direction);
            setQiblaAngle(angle);
          }
        });
      } catch (error) {
        console.error('Error initializing compass:', error);
        setErrorMessage('Error initializing compass. Please try again.');
      }
    };

    initializeCompass();

    // Cleanup
    return () => {
      if (magnetometerSubscription) {
        magnetometerSubscription.unsubscribe();
      }
    };
  }, []);

  return (
    <View className="flex-1 items-center justify-center p-4">
      {errorMessage ? (
        <Text className="text-red-500 text-center mb-4">{errorMessage}</Text>
      ) : (
        <>
          {location ? (
            <Text className="text-gray-600 text-center mb-2">
              Your location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </Text>
          ) : (
            <Text className="text-gray-600 text-center mb-2">Getting your location...</Text>
          )}
          
          <View className="w-64 h-64 relative mb-4">
            {/* Compass background */}
            <View className="w-full h-full rounded-full border-2 border-gray-300 items-center justify-center">
              {/* North indicator */}
              <View className="absolute top-2 items-center">
                <Text className="text-blue-600 font-bold">N</Text>
              </View>
              
              {/* South indicator */}
              <View className="absolute bottom-2 items-center">
                <Text className="text-gray-600 font-bold">S</Text>
              </View>
              
              {/* East indicator */}
              <View className="absolute right-2 items-center">
                <Text className="text-gray-600 font-bold">E</Text>
              </View>
              
              {/* West indicator */}
              <View className="absolute left-2 items-center">
                <Text className="text-gray-600 font-bold">W</Text>
              </View>
              
              {/* Qibla arrow */}
              <View 
                className="absolute w-full h-full items-center justify-center"
                style={{ transform: [{ rotate: `${qiblaAngle}deg` }] }}
              >
                <View className="w-1 h-32 bg-green-600" />
                <View className="absolute top-4 w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-green-600" />
              </View>
            </View>
          </View>
          
          <Text className="text-lg font-semibold text-center text-green-600 mb-2">
            Qibla Direction
          </Text>
          
          <Text className="text-gray-600 text-center">
            Point the top of your device toward the green arrow to face the Qibla.
          </Text>
        </>
      )}
    </View>
  );
};

export default QiblaCompass;
