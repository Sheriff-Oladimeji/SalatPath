import { Audio } from 'expo-av';

// Sound object to keep track of the loaded sound
let sound: Audio.Sound | null = null;

/**
 * Loads and plays an audio file
 * @param audioPath Path to the audio file in the assets folder
 * @param isLooping Whether the audio should loop
 * @param volume Volume level (0 to 1)
 */
export const playAudio = async (
  audioPath: string,
  isLooping: boolean = false,
  volume: number = 1.0
): Promise<void> => {
  try {
    // Unload any existing sound
    if (sound) {
      await sound.unloadAsync();
    }

    console.log(`Loading sound: ${audioPath}`);
    const { sound: newSound } = await Audio.Sound.createAsync(
      // Use require for local assets
      require(`../../assets/sounds/${audioPath}`),
      {
        isLooping,
        volume,
        shouldPlay: true, // Auto play when loaded
      }
    );

    sound = newSound;

    // Set up sound finished callback
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish && !isLooping) {
        // Clean up when finished playing
        unloadSound();
      }
    });
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

/**
 * Stops the currently playing sound
 */
export const stopAudio = async (): Promise<void> => {
  try {
    if (sound) {
      await sound.stopAsync();
    }
  } catch (error) {
    console.error('Error stopping sound:', error);
  }
};

/**
 * Unloads the sound from memory
 */
export const unloadSound = async (): Promise<void> => {
  try {
    if (sound) {
      await sound.unloadAsync();
      sound = null;
    }
  } catch (error) {
    console.error('Error unloading sound:', error);
  }
};

/**
 * Sets up audio mode for the app
 * This should be called when the app starts
 */
export const setupAudio = async (): Promise<void> => {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    console.log('Audio mode set up successfully');
  } catch (error) {
    console.error('Error setting up audio mode:', error);
  }
};
