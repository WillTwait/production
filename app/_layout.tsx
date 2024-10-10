import "@/i18n/i18n";
import "react-native-reanimated";

import MainRoutes from "@/components/MainRoutes";
import TendyThemeProvider from "@/components/TendyThemeProvider";
import { DatabaseProvider } from "@/db/provider";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import * as Sentry from "@sentry/react-native";
import { useFonts } from "expo-font";
import { useNavigationContainerRef } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";

const routingInstrumentation = Sentry.reactNavigationIntegration();

Sentry.init({
  enabled: !__DEV__,
  dsn: "https://1aa0e73dcd98befcaf620fb520dd5854@o4507782612582400.ingest.us.sentry.io/4507782617694208",
  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // enableSpotlight: __DEV__,
  environment: process.env.EXPO_PUBLIC_TENDREL_STAGE,
  tracePropagationTargets: ["localhost", "*.tendrel.io"],
  enableCaptureFailedRequests: true,
  debug: false,
  tracesSampleRate: 0.2,
  integrations: [
    Sentry.reactNativeTracingIntegration({ routingInstrumentation }),
  ],
});

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error("SecureStore getToken error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error("SecureStore saveToken error: ", error);
      return;
    }
  },
};
// biome-ignore lint/style/noNonNullAssertion: We check below for !publishableKey, but that if statement isn't good enough for the ClerkProvider component
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
  );
}

export { ErrorBoundary } from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const ref = useNavigationContainerRef();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (ref) {
      routingInstrumentation.registerNavigationContainer(ref);
    }
  }, [ref]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={Platform.OS !== "web" ? tokenCache : undefined}
    >
      <ClerkLoaded>
        <DatabaseProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <TendyThemeProvider>
              <MainRoutes />
              <Toaster />
            </TendyThemeProvider>
          </GestureHandlerRootView>
        </DatabaseProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

export default Sentry.wrap(RootLayout);
