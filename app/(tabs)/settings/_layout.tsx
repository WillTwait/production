import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          // headerLargeTitle: true,
          // headerTitle: "Settings",
        }}
      />
    </Stack>
  );
}
