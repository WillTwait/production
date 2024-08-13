import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  owner: "tendrel",
  slug: "checklist",
  name: getAppName(),
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: getUniqueIdentifier(),
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: ["expo-router", "expo-localization"],
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
