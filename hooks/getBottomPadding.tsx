import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function getBottomPadding(): number {
  const bottomTabHeight = useBottomTabBarHeight();
  const { bottom } = useSafeAreaInsets();
  return bottomTabHeight - bottom;
}
