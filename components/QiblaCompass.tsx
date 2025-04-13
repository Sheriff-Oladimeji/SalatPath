import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeStore } from "../src/store/useThemeStore";
import {
  calculateQiblaDirection,
  calculateHeading,
  calculateQiblaAngle,
  getCurrentLocation,
  startMagnetometer,
} from "../src/utils/qibla";

const QiblaCompass: React.FC = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [qiblaAngle, setQiblaAngle] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Store qibla direction in a ref to avoid dependency issues
  const qiblaDirectionRef = useRef<number | null>(null);

  // Get theme colors
  const { colors } = useThemeStore();

  // Initialize compass and location
  useEffect(() => {
    let magnetometerSubscription: { unsubscribe: () => void } | null = null;

    const initializeCompass = async () => {
      try {
        // Get current location
        const currentLocation = await getCurrentLocation();

        if (!currentLocation) {
          setErrorMessage(
            "Unable to get your location. Please enable location services."
          );
          return;
        }

        const { latitude, longitude } = currentLocation.coords;
        setLocation({ latitude, longitude });

        // Calculate Qibla direction
        const direction = calculateQiblaDirection(latitude, longitude);
        setQiblaDirection(direction);
        qiblaDirectionRef.current = direction; // Store in ref
      } catch (error) {
        console.error("Error initializing compass:", error);
        setErrorMessage("Error initializing compass. Please try again.");
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

  // Set up magnetometer separately to avoid dependency issues
  useEffect(() => {
    let magnetometerSubscription: { unsubscribe: () => void } | null = null;

    const setupMagnetometer = async () => {
      try {
        // Start magnetometer to get device heading
        magnetometerSubscription = startMagnetometer((data) => {
          const heading = calculateHeading(data);
          setDeviceHeading(heading);

          // Use the ref value instead of the state to avoid dependency issues
          if (qiblaDirectionRef.current !== null) {
            const angle = calculateQiblaAngle(
              heading,
              qiblaDirectionRef.current
            );
            setQiblaAngle(angle);
          }
        });
      } catch (error) {
        console.error("Error setting up magnetometer:", error);
      }
    };

    setupMagnetometer();

    // Cleanup
    return () => {
      if (magnetometerSubscription) {
        magnetometerSubscription.unsubscribe();
      }
    };
  }, []);

  // Create styles based on theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    },
    errorText: {
      color: colors.error,
      textAlign: "center",
      marginBottom: 16,
    },
    locationText: {
      color: colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    compassContainer: {
      width: 256,
      height: 256,
      position: "relative",
      marginBottom: 16,
    },
    compassBackground: {
      width: "100%",
      height: "100%",
      borderRadius: 128,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    directionContainer: {
      position: "absolute",
      alignItems: "center",
    },
    northText: {
      color: colors.accent,
      fontWeight: "bold",
    },
    directionText: {
      color: colors.text,
      fontWeight: "bold",
    },
    qiblaArrow: {
      position: "absolute",
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    arrowLine: {
      width: 4,
      height: 128,
      backgroundColor: colors.primary,
    },
    arrowHead: {
      position: "absolute",
      top: 16,
      width: 0,
      height: 0,
      borderLeftWidth: 8,
      borderRightWidth: 8,
      borderBottomWidth: 16,
      borderLeftColor: "transparent",
      borderRightColor: "transparent",
      borderBottomColor: colors.primary,
    },
    titleText: {
      fontSize: 18,
      fontWeight: "600",
      textAlign: "center",
      color: colors.primary,
      marginBottom: 8,
    },
    instructionText: {
      color: colors.text,
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : (
        <>
          {location ? (
            <Text style={styles.locationText}>
              Your location: {location.latitude.toFixed(4)},{" "}
              {location.longitude.toFixed(4)}
            </Text>
          ) : (
            <Text style={styles.locationText}>Getting your location...</Text>
          )}

          <View style={styles.compassContainer}>
            {/* Compass background */}
            <View style={styles.compassBackground}>
              {/* North indicator */}
              <View style={[styles.directionContainer, { top: 8 }]}>
                <Text style={styles.northText}>N</Text>
              </View>

              {/* South indicator */}
              <View style={[styles.directionContainer, { bottom: 8 }]}>
                <Text style={styles.directionText}>S</Text>
              </View>

              {/* East indicator */}
              <View style={[styles.directionContainer, { right: 8 }]}>
                <Text style={styles.directionText}>E</Text>
              </View>

              {/* West indicator */}
              <View style={[styles.directionContainer, { left: 8 }]}>
                <Text style={styles.directionText}>W</Text>
              </View>

              {/* Qibla arrow */}
              <View
                style={[
                  styles.qiblaArrow,
                  { transform: [{ rotate: `${qiblaAngle}deg` }] },
                ]}
              >
                <View style={styles.arrowLine} />
                <View style={styles.arrowHead} />
              </View>
            </View>
          </View>

          <Text style={styles.titleText}>Qibla Direction</Text>

          <Text style={styles.instructionText}>
            Point the top of your device toward the green arrow to face the
            Qibla.
          </Text>
        </>
      )}
    </View>
  );
};

export default QiblaCompass;
