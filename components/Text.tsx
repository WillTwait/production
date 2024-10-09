import { useTheme } from "@/hooks/useTheme";
import { Text as ReactNativeText, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link" | "gray";
};

export function Text({ style, type = "default", ...rest }: ThemedTextProps) {
  const { colors } = useTheme();

  return (
    <ReactNativeText
      style={[
        { color: colors.tendrel.text2.color },
        type === "default"
          ? {
              fontSize: 14,
              lineHeight: 24,
            }
          : undefined,
        type === "title"
          ? {
              fontSize: 20,
              fontWeight: "bold",
              lineHeight: 32,
            }
          : undefined,
        type === "defaultSemiBold"
          ? {
              fontSize: 16,
              lineHeight: 24,
              fontWeight: "600",
            }
          : undefined,
        type === "subtitle"
          ? {
              fontSize: 20,
              fontWeight: "bold",
            }
          : undefined,
        type === "link"
          ? {
              lineHeight: 30,
              fontSize: 16,
              color: "#0a7ea4",
            }
          : undefined,
        type === "gray"
          ? {
              fontSize: 16,
              color: colors.tendrel.button1.gray,
            }
          : undefined,
        style,
      ]}
      {...rest}
    />
  );
}
