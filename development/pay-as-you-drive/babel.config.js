module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'module:babel-preset-expo',
      'module:metro-react-native-babel-preset',
      'module:react-native-dotenv'
    ],
  };
};
