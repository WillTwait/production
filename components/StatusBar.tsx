import { useTheme } from "@/hooks/useTheme";
import { StatusBar as RNStatusBar } from "react-native";

export function StatusBar() {
  const { colorTheme } = useTheme();
  return (
    <RNStatusBar
      barStyle={colorTheme === "light" ? "dark-content" : "light-content"}
    />
  );
}
