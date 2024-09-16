import Avatar from "@/components/Avatar";
import { UserProfile } from "@/components/UserProfile";
import useThemeContext from "@/hooks/useTendyTheme";
import { useTendrel } from "@/tendrel/provider";
import { BlurView } from "expo-blur";

import { Stack } from "expo-router";

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Platform, PlatformColor } from "react-native";
import type { ActionSheetRef } from "react-native-actions-sheet";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function HomeLayout() {
  const { colors } = useThemeContext();

  const actionSheetRef = useRef<ActionSheetRef>(null);
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerBlurEffect: "prominent",
        headerShown: Platform.OS !== "web", //Web doesnt support search bar,
        headerTransparent: Platform.OS === "ios",
        headerRight: () => (
          <>
            <TouchableOpacity onPress={() => actionSheetRef.current?.show()}>
              {/* TODO: Make real */}
              <Avatar firstName="Jerry" lastName="Garcia" />
              {/* TODO: Make real */}
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
          headerTitle: t("screenNames.checklists.t").capitalize(),
        }}
      />
      <Stack.Screen
        name="work"
        options={{
          headerTitle: t("screenNames.work.t").capitalize(),
        }}
      />
      <Stack.Screen
        name="camera"
        options={{
          headerShown: false,
          presentation: "formSheet",
        }}
      />
    </Stack>
  );
}
