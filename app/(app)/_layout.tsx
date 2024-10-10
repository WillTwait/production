import { useTheme } from "@/hooks/useTheme";
import { RelayProvider } from "@/relay/provider";
import { TendrelProvider } from "@/tendrel/provider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";

const AppEntryLayout = () => {
  const { colorTheme } = useTheme();
  return (
    <ThemeProvider value={colorTheme === "dark" ? DarkTheme : DefaultTheme}>
      <RelayProvider url={process.env.EXPO_PUBLIC_TENDREL_GRAPHQL_URL}>
        <TendrelProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </TendrelProvider>
      </RelayProvider>
    </ThemeProvider>
  );
};

export default AppEntryLayout;
