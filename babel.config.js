module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-worklets/plugin" // use this instead of react-native-reanimated/plugin
    ],
  };
};
