// metro.config.js
// Custom Metro config for web platform compatibility

const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Add web-specific module resolutions
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // On web, replace react-native-maps with our web shim
  if (platform === "web" && moduleName === "react-native-maps") {
    return {
      filePath: path.resolve(__dirname, "shims/react-native-maps.web.tsx"),
      type: "sourceFile",
    };
  }

  // Use default resolution for everything else
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
