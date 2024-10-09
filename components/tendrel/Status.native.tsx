import { useFragment } from "react-relay";
import { Status$fragment, type Status$key } from "./Status";
import { Temporal, type TemporalProps } from "./Temporal.native";

interface Props extends Omit<TemporalProps, "queryRef"> {
  queryRef: Status$key;
}

export function Status({ queryRef, ...props }: Props) {
  const data = useFragment(Status$fragment, queryRef);
  switch (data.__typename) {
    case "ChecklistOpen":
      return <Temporal queryRef={data.openedAt} {...props} />;
    case "ChecklistInProgress":
      return <Temporal queryRef={data.inProgressAt} {...props} />;
    case "ChecklistClosed":
      return <Temporal queryRef={data.closedAt} {...props} />;
    case "%other":
      return null;
  }
}
