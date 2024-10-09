import { useAuth } from "@clerk/clerk-expo";

import { Redirect, Tabs } from "expo-router";

import { useTheme } from "@/hooks/useTheme";

import { View } from "@/components/View";
import { ClipboardCheck, Cog } from "lucide-react-native";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  const { colors } = useTheme();
  const { t } = useTranslation();
  if (!isLoaded) return null;

  //Gave up trying to get navigation correct, ended up using this hacky method of wrapping the redirect in the same color as the splash screen and changing the sign in page animation 🤷.
  //Issue described here (farther down the page): https://github.com/expo/router/issues/428
  if (!isSignedIn) {
    return (
      <View style={{ flex: 1, backgroundColor: "#2a283e" }}>
        <Redirect href="/sign-in" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: t("tabBar.checklists.t").capitalize(),
          headerShown: false,
          tabBarLabelStyle: {
            color: colors.tendrel.text2.color,
            fontSize: 12,
          },
          tabBarTestID: "checklistsTab",
          tabBarIcon: ({ focused }) => (
            <ClipboardCheck
              size={26}
              color={
                focused
                  ? colors.tendrel.text2.color
                  : colors.tendrel.interactive3.gray
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: "/(tabs)/settings",
          title: t("tabBar.Settings.t").capitalize(),
          tabBarLabelStyle: {
            color: colors.tendrel.text2.color,
            fontSize: 12,
          },
          tabBarTestID: "settingsTab",
          tabBarIcon: ({ focused }) => (
            <Cog
              size={26}
              color={
                focused
                  ? colors.tendrel.text2.color
                  : colors.tendrel.interactive3.gray
              }
            />
          ),
        }}
      />
    </Tabs>
  );
}
