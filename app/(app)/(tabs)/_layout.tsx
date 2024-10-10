import { useTheme } from "@/hooks/useTheme";
import { Tabs } from "expo-router";
import { ClipboardCheck, Cog } from "lucide-react-native";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(checklists)"
        options={{
          title: t("tabBar.checklists.t"),
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
          title: t("tabBar.Settings.t"),
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
