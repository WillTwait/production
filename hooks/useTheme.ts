import { ThemeContext } from "@/components/TendyThemeProvider";
import colors from "@/constants/tendy-colors";
import { useCallback, useContext, useMemo } from "react";
import { type ColorSchemeName, useColorScheme } from "react-native";

export function useTheme() {
  const context = useContext(ThemeContext);
  const systemColorScheme = useColorScheme();

  if (context === undefined) {
    throw new Error("useThemeContext must be within ThemeProvider");
  }

  const { theme, loading, setTheme } = context;

  if (loading) {
    throw new Error("Tried to use ThemeContext before initialized");
  }

  const colorTheme: NonNullable<ColorSchemeName> =
    theme ?? systemColorScheme ?? "light";

  return {
    colors: useMemo(() => {
      return colors[colorTheme || "light"];
    }, [colorTheme]),
    inverseColors: useMemo(() => {
      return colors[(colorTheme || "light") === "light" ? "dark" : "light"];
    }, [colorTheme]),
    colorTheme,
    isSystemTheme: !theme,
    isDark: theme === "dark",
    systemTheme: systemColorScheme,
    setColorTheme: useCallback(
      (themeName: ColorSchemeName) => setTheme(themeName),
      [setTheme],
    ),
  };
}
