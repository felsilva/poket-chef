import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: "Poket Chef",
  slug: "poket-chef",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./src/assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./src/assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.poket.chef"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./src/assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: "com.poket.chef"
  },
  web: {
    favicon: "./src/assets/favicon.png"
  },
  plugins: [
    "expo-router",
    [
      "expo-camera",
      {
        "cameraPermission": "Esta aplicación necesita acceso a la cámara para escanear códigos de barras y tomar fotos de productos."
      }
    ]
  ]
};

export default config; 