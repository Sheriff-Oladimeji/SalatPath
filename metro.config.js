const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Get the default Metro config
const config = getDefaultConfig(__dirname);

// Add additional Reanimated configuration
config.resolver.sourceExts.push("mjs");

// Apply NativeWind configuration
module.exports = withNativeWind(config, { input: "./global.css" });
