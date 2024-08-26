import useThemeContext from "@/hooks/useTendyTheme";
import type { ViewProps } from "react-native";
import { View } from "./View";

type Props = ViewProps & {
  orientation?: "horizontal" | "vertical";
  width?: number;
};

export default function Seperator({
  orientation = "horizontal",
  width = 1,
}: Props) {
  const { colors } = useThemeContext();
  return (
    <View
      style={{
        backgroundColor: colors.tendrel.interactive2.gray,
        alignSelf: "center",
        width: orientation === "horizontal" ? "95%" : width,
        height: orientation === "vertical" ? "95%" : width,
      }}
    />
  );
}
