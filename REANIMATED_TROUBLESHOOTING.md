# Reanimated Troubleshooting Guide

This guide will help you resolve common issues with React Native Reanimated in your Expo project.

## Common Errors

### 1. Mismatch between JavaScript code version and Reanimated Babel plugin version

**Error Message:**
```
ReanimatedError: [Reanimated] Mismatch between JavaScript code version and Reanimated Babel plugin version (3.16.7 vs. 3.17.3).
```

**Solution:**

1. **Run the fix-reanimated script:**
   ```bash
   npm run fix-reanimated
   # or
   yarn fix-reanimated
   ```

2. **If the issue persists, manually fix it:**
   - Clear Metro cache: `expo start --clear`
   - Delete node_modules: `rm -rf node_modules`
   - Reinstall dependencies: `npm install` or `yarn`
   - Restart your development server

### 2. Native part of Reanimated doesn't seem to be initialized

**Error Message:**
```
ReanimatedError: [Reanimated] Native part of Reanimated doesn't seem to be initialized (Worklets).
```

**Solution:**

1. Make sure your babel.config.js includes the Reanimated plugin:
   ```javascript
   module.exports = function (api) {
     api.cache(true);
     return {
       presets: [
         ["babel-preset-expo", { jsxImportSource: "nativewind" }],
         "nativewind/babel",
       ],
       plugins: [
         // Make sure Reanimated plugin is the last plugin
         "react-native-reanimated/plugin",
       ],
     };
   };
   ```

2. Ensure your package.json has the correct version of Reanimated:
   ```json
   "dependencies": {
     "react-native-reanimated": "~3.16.1"
   },
   "resolutions": {
     "react-native-reanimated": "~3.16.1"
   }
   ```

3. Rebuild your app:
   ```bash
   expo prebuild --clean
   expo run:ios  # or expo run:android
   ```

### 3. Multiple versions of Reanimated were detected

**Solution:**

Add a resolutions field to your package.json:

```json
"resolutions": {
  "react-native-reanimated": "~3.16.1"
}
```

For npm users, use overrides instead:

```json
"overrides": {
  "react-native-reanimated": "~3.16.1"
}
```

## Compatibility with Expo SDK 52

For Expo SDK 52, use these specific versions:

```json
"@react-native-async-storage/async-storage": "1.23.1",
"expo-location": "~18.0.10",
"expo-sensors": "~14.0.2",
"react-native-reanimated": "~3.16.1",
"react-native-safe-area-context": "4.12.0"
```

## Advanced Troubleshooting

If you're still experiencing issues:

1. **Check for conflicting packages:**
   ```bash
   npm ls react-native-reanimated
   # or
   yarn why react-native-reanimated
   ```

2. **Verify metro.config.js:**
   ```javascript
   const { getDefaultConfig } = require("expo/metro-config");
   const { withNativeWind } = require("nativewind/metro");

   // Get the default Metro config
   const config = getDefaultConfig(__dirname);

   // Add additional Reanimated configuration
   config.resolver.sourceExts.push("mjs");

   // Apply NativeWind configuration
   module.exports = withNativeWind(config, { input: "./global.css" });
   ```

3. **Check app/_layout.tsx:**
   Make sure you're importing Reanimated correctly:
   ```javascript
   // Import Reanimated
   import "react-native-reanimated";
   ```

## Useful Commands

- **Clean project cache:**
  ```bash
  npm run clean
  # or
  yarn clean
  ```

- **Fix Reanimated issues:**
  ```bash
  npm run fix-reanimated
  # or
  yarn fix-reanimated
  ```

- **Reset project:**
  ```bash
  npm run reset-project
  # or
  yarn reset-project
  ```

## Additional Resources

- [Official Reanimated Troubleshooting Guide](https://docs.swmansion.com/react-native-reanimated/docs/guides/troubleshooting)
- [Expo SDK 52 Documentation](https://docs.expo.dev/versions/v52.0.0/)
