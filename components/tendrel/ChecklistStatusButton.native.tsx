import type { ChecklistStatusButton_fragment$key } from "@/__generated__/ChecklistStatusButton_fragment.graphql";
import { useTheme } from "@/hooks/useTheme";
import { TimerIcon } from "lucide-react-native";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
import { graphql, useFragment } from "react-relay";
import { Button } from "../Button";
import Timer from "../Timer";

interface Props {
  queryRef: ChecklistStatusButton_fragment$key;
}

export function ChecklistStatusButton({ queryRef }: Props) {
  const data = useFragment(
    graphql`
      fragment ChecklistStatusButton_fragment on ChecklistStatus {
        ... on ChecklistOpen {
          __typename
        }
        ... on ChecklistInProgress {
          __typename
          inProgressAt {
            epochMilliseconds
          }
        }
      }
    `,
    queryRef,
  );

  const { colors } = useTheme();
  const { t } = useTranslation();

  // TODO: We should handle ChecklistClosed here as well, since this component
  // is in theory reusable regardless of status.
  switch (data.__typename) {
    case "ChecklistOpen":
      return (
        <Button
          disabled
          variant="filled"
          title={t("workScreen.notStarted.t")}
          textColor={colors.tendrel.text2.color}
          color={colors.tendrel.interactive3.color}
        />
      );
    case "ChecklistInProgress":
      return (
        <Button
          disabled
          variant="filled"
          icon={<TimerIcon size={16} color={colors.tendrel.text1.color} />}
          title=""
          textColor={colors.tendrel.text2.color}
          color={colors.tendrel.interactive3.color}
        >
          <Timer
            startTime={DateTime.fromMillis(
              Number(data.inProgressAt.epochMilliseconds),
            )}
          />
        </Button>
      );
  }
}
