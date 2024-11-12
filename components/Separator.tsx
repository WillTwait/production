import { useTheme } from "@/hooks/useTheme";
import type { ViewProps } from "react-native";
import { View } from "./View";

type Props = ViewProps & {
  orientation?: "horizontal" | "vertical";
  width?: number;
};

export default function Seperator({
  orientation = "horizontal",
  width = 1,
  ...props
}: Props) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        backgroundColor: colors.tendrel.interactive2.gray,
        alignSelf: "center",
        width: orientation === "horizontal" ? "95%" : width,
        height: orientation === "vertical" ? "95%" : width,
      }}
      {...props}
    />
  );
}
