import Avatar from "@/components/Avatar";
import { UserProfile } from "@/components/UserProfile";
import { useTheme } from "@/hooks/useTheme";
import { useTendrel } from "@/tendrel/provider";
import { Stack } from "expo-router";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import type { ActionSheetRef } from "react-native-actions-sheet";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Layout() {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const { colors } = useTheme();
  const { t } = useTranslation();
  const {
    user: { firstName, lastName },
  } = useTendrel();

  return (
    <Stack
      screenOptions={{
        headerBlurEffect: "prominent",
        headerShown: Platform.OS !== "web", // Web doesnt support search bar
        headerTransparent: Platform.OS === "ios",
        headerRight: () => (
          <>
            <TouchableOpacity onPress={() => actionSheetRef.current?.show()}>
              <Avatar
                fallback={`${firstName.at(0)?.toUpperCase()}${lastName.at(0)?.toUpperCase()}`}
              />
              <UserProfile actionSheetRef={actionSheetRef} />
            </TouchableOpacity>
          </>
        ),
        headerTintColor: colors.tendrel.text2.color,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerSearchBarOptions: {
            hideWhenScrolling: true,
            autoCapitalize: "none",
            textColor: colors.tendrel.text2.color,
            headerIconColor: colors.tendrel.text2.color,
          },
          headerTitle: t("screenNames.checklists.t"),
        }}
      />
      <Stack.Screen
        name="checklist/[checklist]"
        options={{ headerTitle: "" }}
      />
    </Stack>
  );
}
