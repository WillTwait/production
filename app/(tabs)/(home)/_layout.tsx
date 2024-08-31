import Avatar from "@/components/Avatar";
import { UserProfile } from "@/components/UserProfile";
import useThemeContext from "@/hooks/useTendyTheme";

import { Stack } from "expo-router";

import { useRef } from "react";
import { Platform } from "react-native";
import type { ActionSheetRef } from "react-native-actions-sheet";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function HomeLayout() {
  const { colorTheme } = useThemeContext();
  const actionSheetRef = useRef<ActionSheetRef>(null);

  return (
    <Stack
      screenOptions={{
        headerTransparent: Platform.OS === "ios",
        headerSearchBarOptions: {
          hideWhenScrolling: true,
          autoCapitalize: "none",
        },
        headerBlurEffect: colorTheme,
        headerShown: Platform.OS !== "web", //Web doesnt support search bar

        headerLeft: () => (
          <>
            <TouchableOpacity onPress={() => actionSheetRef.current?.show()}>
              {/* TODO: Make real */}
              <Avatar firstName="Jerry" lastName="Garcia" />
              {/* TODO: Make real */}
              <UserProfile actionSheetRef={actionSheetRef} />
            </TouchableOpacity>
          </>
        ),
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
