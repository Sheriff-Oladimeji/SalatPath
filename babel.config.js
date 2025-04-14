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
