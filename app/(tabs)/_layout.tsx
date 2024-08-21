import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import { Redirect, Tabs } from "expo-router";
import React, { Suspense } from "react";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <SignedIn>
        <Suspense fallback="Loading...">
          <Tabs
            screenOptions={{
              tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
              headerShown: false,
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: "Home",
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon
                    name={focused ? "home" : "home-outline"}
                    color={color}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="explore"
              options={{
                title: "Explore",
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon
                    name={focused ? "code-slash" : "code-slash-outline"}
                    color={color}
                  />
                ),
              }}
            />
          </Tabs>
        </Suspense>
      </SignedIn>
      <SignedOut>
        <Redirect href="/sign-in" />
      </SignedOut>
    </>
  );
}
