export default {
  "expo": {
    "name": "Poket Chef",
    "slug": "poket-chef",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.poket.chef",
      "infoPlist": {
        "NSCameraUsageDescription": "Esta aplicación necesita acceso a la cámara para escanear códigos de barras y tomar fotos de productos."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.poket.chef",
      "permissions": ["CAMERA"]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-camera",
        {
          "cameraPermission": "La aplicación necesita acceso a la cámara para escanear códigos de barras y tomar fotos de productos."
        }
      ]
    ]
  }
} 