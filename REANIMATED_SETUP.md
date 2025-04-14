# Fixing Reanimated Issues

If you encounter issues with React Native Reanimated after updating packages, follow these steps to resolve them:

## Common Errors

1. **Native part of Reanimated doesn't seem to be initialized (Worklets)**
2. **Missing default export in layout files**

## Solution Steps

### 1. Ensure Proper Configuration

Make sure your `babel.config.js` includes the Reanimated plugin:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};
```

### 2. Update Metro Config

Ensure your `metro.config.js` includes support for Reanimated:

```javascript
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Get the default Metro config
const config = getDefaultConfig(__dirname);

// Add additional Reanimated configuration
config.resolver.sourceExts.push('mjs');

// Apply NativeWind configuration
module.exports = withNativeWind(config, { input: "./global.css" });
```

### 3. Import Reanimated Correctly

In your layout files, make sure to import Reanimated correctly:

```javascript
// Import Reanimated
import "react-native-reanimated";
```

### 4. Reset the Project

Run the reset script to clear caches and restart the app:

```bash
npm run reset-project
```

Or manually:

```bash
watchman watch-del-all
rm -rf node_modules/.cache
expo start --clear
```

### 5. Reinstall if Necessary

If issues persist, try reinstalling the package:

```bash
npm uninstall react-native-reanimated
npm install react-native-reanimated
```

## Additional Tips

- Make sure the Reanimated plugin is listed LAST in your babel plugins
- Restart your development server completely after making configuration changes
- Check for version compatibility between Expo and Reanimated

## Troubleshooting

If you still encounter issues:

1. Check the [official Reanimated troubleshooting guide](https://docs.swmansion.com/react-native-reanimated/docs/guides/troubleshooting)
2. Make sure all related packages are updated (gesture-handler, etc.)
3. Try using a specific version of Reanimated that is known to work with your Expo version
