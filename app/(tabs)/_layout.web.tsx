import useThemeContext from "@/hooks/useTendyTheme";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";
import Head from "expo-router/head";

import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  const { isSignedIn } = useAuth();
  const { colors } = useThemeContext();

  if (!isSignedIn) {
    return <Redirect href={"/sign-in"} />;
  }

  return (
    <>
      <Head>
        <meta
          name="theme-color"
          content={colors.backgrounds.default}
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content={colors.backgrounds.default}
          media="(prefers-color-scheme: dark)"
        />
      </Head>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          screenOptions={{
            headerTintColor: colors.tendrel.text1.color,
            headerStyle: {
              backgroundColor: colors.tendrel.background1.color,
            },
            headerTitleStyle: { color: colors.tendrel.text1.color },
            drawerStyle: {
              backgroundColor: colors.tendrel.background1.color,
            },
            drawerLabelStyle: { color: colors.tendrel.text1.color },
            drawerActiveTintColor: colors.tendrel.text1.color,
          }}
        >
          <Drawer.Screen
            name="(home)"
            options={{
              drawerLabel: "Checklists",
              title: "Checklists",
            }}
          />
          <Drawer.Screen
            name="settings"
            options={{
              drawerLabel: "Settings",
              title: "Settings",
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
    </>
  );
}
