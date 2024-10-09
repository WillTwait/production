import { useFragment } from "react-relay";
import Avatar from "../Avatar";
import { Assignee$fragment, type Assignee$key } from "./Assignee";

interface Props {
  queryRef: Assignee$key;
  size?: number;
}

export function Assignee({ queryRef, ...props }: Props) {
  const data = useFragment(Assignee$fragment, queryRef);

  if (data.assignedTo.__typename !== "Worker") {
    return null;
  }

  const {
    assignedTo: { firstName, lastName },
  } = data;

  return (
    <Avatar
      fallback={`${firstName.at(0)?.toUpperCase()}${lastName.at(0)?.toUpperCase()}`}
      {...props}
    />
  );
}
