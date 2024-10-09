import type { ChecklistTimer_fragment$key } from "@/__generated__/ChecklistTimer_fragment.graphql";
import { DateTime } from "luxon";
import type { TextProps } from "react-native";
import { graphql, useFragment } from "react-relay";
import Timer from "../Timer";

interface Props extends TextProps {
  queryRef: ChecklistTimer_fragment$key;
}

export function ChecklistTimer({ queryRef }: Props) {
  const data = useFragment(
    graphql`
      fragment ChecklistTimer_fragment on ChecklistInProgress {
        inProgressAt {
          epochMilliseconds
        }
      }
    `,
    queryRef,
  );

  return (
    <Timer
      startTime={DateTime.fromMillis(
        Number(data.inProgressAt.epochMilliseconds),
      )}
    />
  );
}
