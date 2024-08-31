import { useAuth } from "@clerk/clerk-expo";

import { Redirect, Tabs } from "expo-router";

import useThemeContext from "@/hooks/useTendyTheme";

import { ClipboardCheck, Cog } from "lucide-react-native";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  const { colors } = useThemeContext();
  const { t } = useTranslation();
  if (!isLoaded) return null;

  // FIXME: Ideally this is handled by a layout? //murphy: maybe yes actually, since we are storing the login in async storage, when you login if it hits an index file => then redirects to another file, you get the next screen animation. But could be me being dumb and not having the redirect in the right place
  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: t("tabBar.checklists.t").capitalize(),
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
                  : colors.tendrel.button1.gray
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
                  : colors.tendrel.button1.gray
              }
            />
          ),
        }}
      />
    </Tabs>
  );
}
