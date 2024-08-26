import useThemeContext from "@/hooks/useTendyTheme";
import { View as ReactNativeView, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  inverse?: boolean;
};

export function View({ inverse, style, ...otherProps }: ThemedViewProps) {
  const { colors } = useThemeContext();

  return (
    <ReactNativeView
      style={[
        {
          backgroundColor: inverse //TODO: actuall make inverse
            ? "#FFFFFF"
            : colors.tendrel.background2.color,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
