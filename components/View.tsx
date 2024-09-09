import useThemeContext from "@/hooks/useTendyTheme";
import { View as ReactNativeView, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  inverse?: boolean;
};

export function View({ inverse, style, ...otherProps }: ThemedViewProps) {
  return (
    <ReactNativeView
      style={[
        {
          backgroundColor: inverse //TODO: actuall make inverse
            ? "#FFFFFF"
            : "inherit",
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
