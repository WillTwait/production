import { RelayProvider } from "@/relay/provider";
import { TendrelProvider } from "@/tendrel/provider";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

const AppEntryLayout = () => {
  return (
    <>
      <SignedOut>
        <Redirect href="/(auth)/sign-in" />
      </SignedOut>
      <SignedIn>
        <RelayProvider url={process.env.EXPO_PUBLIC_TENDREL_GRAPHQL_URL}>
          <TendrelProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </TendrelProvider>
        </RelayProvider>
      </SignedIn>
    </>
  );
};

export default AppEntryLayout;
