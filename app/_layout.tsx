import "@/i18n/i18n";
import "react-native-get-random-values";

import { DatabaseProvider } from "@/db/provider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import * as Application from "expo-application";
import { useFonts } from "expo-font";
import { type ErrorBoundaryProps, Slot, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { StatusBar } from "@/components/StatusBar";
import TendyThemeProvider from "@/components/TendyThemeProvider";
import { useTheme } from "@/hooks/useTheme";
import { RelayProvider } from "@/relay/provider";
import { TendrelProvider } from "@/tendrel/provider";
import {
  ClerkLoaded,
  ClerkProvider,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-expo";
import { Platform, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <Text>{error.message}</Text>
      <Text onPress={retry}>Try Again?</Text>
    </View>
  );
}

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

// Construct a new instrumentation instance. This is needed to communicate between the integration and React
const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
  dsn: "https://1aa0e73dcd98befcaf620fb520dd5854@o4507782612582400.ingest.us.sentry.io/4507782617694208",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  release: `${Application.nativeApplicationVersion}:${Application.nativeBuildVersion}`,
  _experiments: {
    // profilesSampleRate is relative to tracesSampleRate.
    // Here, we'll capture profiles for 100% of transactions.
    profilesSampleRate: 1.0,
  },
  environment: process.env.EXPO_PUBLIC_TENDREL_STAGE,
  debug: false,
  integrations: [
    new Sentry.ReactNativeTracing({
      // Pass instrumentation to be used as `routingInstrumentation`
      routingInstrumentation,
      // ...
    }),
  ],
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

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
          <TendyThemeProvider>
            <NavLayout />
          </TendyThemeProvider>
        </DatabaseProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

// This is kinda dumb but whatever
function NavLayout() {
  const { colorTheme } = useTheme();

  return (
    <ThemeProvider value={colorTheme === "dark" ? DarkTheme : DefaultTheme}>
      <SignedOut>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="sign-in"
            options={{
              headerShown: false,
              animation: "fade_from_bottom",
            }}
          />
        </Stack>
      </SignedOut>
      <SignedIn>
        <RelayProvider url={process.env.EXPO_PUBLIC_TENDREL_GRAPHQL_URL}>
          <TendrelProvider>
            <GestureHandlerRootView>
              <SafeAreaProvider>
                <StatusBar />
                <Slot />
              </SafeAreaProvider>
              <Toaster />
            </GestureHandlerRootView>
          </TendrelProvider>
        </RelayProvider>
      </SignedIn>
    </ThemeProvider>
  );
}

export default Sentry.wrap(RootLayout);
