import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  owner: "tendrel",
  slug: "checklist",
  scheme: "checklist",
  name: getAppName(),
  version: "0.0.1",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#87a19a",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: getUniqueIdentifier(),
    backgroundColor: "#87a19a",
    infoPlist: {
      // Clears the warning we get from the app store about macOS compatibility
      LSMinimumSystemVersion: "12.0",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#87a19a",
    },
    package: getUniqueIdentifier(),
  },
  web: {
    bundler: "metro",
    output: "single",
    favicon: "./assets/images/favicon.png",
  },

  plugins: [
    "expo-router",
    "expo-font",
    "expo-localization",
    [
      "expo-camera",
      {
        cameraPermission: "Allow Tendrel Checklist to access your camera",
        microphonePermission:
          "Allow Tendrel Checklist to access your microphone",
        recordAudioAndroid: true,
      },
    ],
    [
      "@sentry/react-native/expo",
      {
        organization: "tendrel",
        project: "checklist",
        url: "https://sentry.io/",
      },
    ],
  ],
  extra: {
    eas: {
      projectId: "7dd59d91-ed34-4992-8994-3edbbbd40c45",
    },
  },
  updates: {
    url: "https://u.expo.dev/7dd59d91-ed34-4992-8994-3edbbbd40c45",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  experiments: {
    typedRoutes: true,
  },
});

const IS_DEV = process.env.APP_VARIANT === "development";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.tendrel.checklist.dev";
  }

  return "com.tendrel.checklist";
};

const getAppName = () => {
  if (IS_DEV) {
    return "Checklist (Dev)";
  }

  return "Checklist";
};
