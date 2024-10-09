import { useFragment } from "react-relay";
import { DisplayName$fragment, type DisplayName$key } from "./DisplayName";
import { DynamicString, type DynamicStringProps } from "./DynamicString.native";

interface Props extends Omit<DynamicStringProps, "queryRef"> {
  queryRef: DisplayName$key;
}

export function DisplayName({ queryRef, ...props }: Props) {
  const data = useFragment(DisplayName$fragment, queryRef);
  return <DynamicString queryRef={data.name} {...props} />;
}
