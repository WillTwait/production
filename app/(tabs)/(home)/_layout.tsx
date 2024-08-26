import Avatar from "@/components/Avatar";
import useThemeContext from "@/hooks/useTendyTheme";
import { Stack } from "expo-router";
import { Settings2 } from "lucide-react-native";
import { Platform } from "react-native";

export default function HomeLayout() {
  const { colors, colorTheme } = useThemeContext();
  return (
    <Stack
      screenOptions={{
        headerTransparent: Platform.OS === "ios",
        headerBlurEffect: colorTheme,
        headerShown: Platform.OS !== "web", //Web doesnt support search bar
        headerSearchBarOptions: {
          hideWhenScrolling: true,
          autoCapitalize: "none",
          textColor: colors.tendrel.text2.color,
          tintColor: colors.tendrel.text1.color,
        },
        headerLeft: () => <Avatar firstName="Jerry" lastName="Garcia" />, //TODO: make real
        headerRight: () => <Settings2 color={colors.tendrel.button1.color} />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Checklists",
        }}
      />
    </Stack>
  );
}
