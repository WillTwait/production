import Avatar from "@/components/Avatar";
import { UserProfile } from "@/components/UserProfile";
import { useTheme } from "@/hooks/useTheme";
import { useTendrel } from "@/tendrel/provider";
import { Stack } from "expo-router";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Platform, TouchableOpacity } from "react-native";
import type { ActionSheetRef } from "react-native-actions-sheet";

export default function Layout() {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const { colors } = useTheme();
  const {
    user: { firstName, lastName },
    currentOrganization,
  } = useTendrel();

  return (
    <Stack
      screenOptions={{
        headerBlurEffect: "prominent",
        headerShown: Platform.OS !== "web", // Web doesnt support search bar
        headerRight: () => (
          <TouchableOpacity onPress={() => actionSheetRef.current?.show()}>
            <Avatar
              fallback={`${firstName.at(0)?.toUpperCase()}${lastName.at(0)?.toUpperCase()}`}
            />
            <UserProfile actionSheetRef={actionSheetRef} />
          </TouchableOpacity>
        ),
        headerTintColor: colors.tendrel.text2.color,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          header: undefined,
          headerTransparent: Platform.OS === "ios",
          headerSearchBarOptions: {
            hideWhenScrolling: false,
            autoCapitalize: "none",
          },
          headerTitle: currentOrganization?.name,
        }}
      />
      <Stack.Screen
        name="checklist/[checklist]"
        options={{ headerTitle: "", headerTransparent: Platform.OS === "ios" }}
      />
    </Stack>
  );
}
