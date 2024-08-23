import useThemeContext from "@/hooks/useTendyTheme";
import { View, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const { colors } = useThemeContext();

  return (
    <View
      style={[{ backgroundColor: colors.tendrel.background2.color }, style]}
      {...otherProps}
    />
  );
}
