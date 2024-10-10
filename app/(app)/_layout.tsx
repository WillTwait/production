import { RelayProvider } from "@/relay/provider";
import { TendrelProvider } from "@/tendrel/provider";
import { Stack } from "expo-router";

const AppEntryLayout = () => {
  return (
    <RelayProvider url={process.env.EXPO_PUBLIC_TENDREL_GRAPHQL_URL}>
      <TendrelProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </TendrelProvider>
    </RelayProvider>
  );
};

export default AppEntryLayout;
