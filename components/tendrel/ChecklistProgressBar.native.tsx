import { useTheme } from "@/hooks/useTheme";
import { ProgressView } from "@react-native-community/progress-view";
import { useTranslation } from "react-i18next";
import { useFragment } from "react-relay";
import { Text } from "../Text";
import { View } from "../View";
import {
  ChecklistProgressBar$fragment,
  type ChecklistProgressBar$key,
} from "./ChecklistProgressBar";

interface Props {
  queryRef: ChecklistProgressBar$key;
}

export function ChecklistProgressBar({ queryRef }: Props) {
  const data = useFragment(ChecklistProgressBar$fragment, queryRef);
  const { colors } = useTheme();
  const { t } = useTranslation();

  const dividend = data.items.edges.filter(
    e => e.node.status?.__typename === "ChecklistClosed",
  ).length;
  const divisor = data.items.totalCount;

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <ProgressView
        progressTintColor={colors.tendrel.button2.color}
        trackTintColor={colors.tendrel.interactive3.color}
        style={{ width: "100%" }}
        progress={divisor === 0 ? 0 : dividend / divisor}
      />
      <Text>{t("workScreen.numberOfCompleted.t", { dividend, divisor })}</Text>
    </View>
  );
}
