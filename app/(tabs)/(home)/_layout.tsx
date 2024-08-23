import useThemeContext from "@/hooks/useTendyTheme";
import { Stack } from "expo-router";
import { Settings2 } from "lucide-react-native";
import { Platform, Text, View } from "react-native";

export default function HomeLayout() {
  const { colors } = useThemeContext();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: !(Platform.OS === "web"), //Web doesnt support search bar
          headerSearchBarOptions: {
            hideWhenScrolling: true,
            autoCapitalize: "none",
          },
          headerTitle: "Checklists",
          headerLeft: () => (
            <View
              style={{
                backgroundColor: colors.tendrel.button1.color,
                padding: 6,
                marginRight: 6,
                borderRadius: 100,
              }}
            >
              <Text style={{ color: "#FFFFFF" }}>TM</Text>
            </View>
          ),
          headerRight: () => <Settings2 color={colors.tendrel.button1.color} />,
          // headerLargeTitle: true,
          // headerTitle: "Home",
        }}
      />
    </Stack>
  );
}
