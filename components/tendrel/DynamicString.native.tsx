import { useFragment } from "react-relay";
import { Text, type ThemedTextProps } from "../Text";
import {
  DynamicString$fragment,
  type DynamicString$key,
} from "./DynamicString";

interface Props extends ThemedTextProps {
  queryRef: DynamicString$key;
}

export function DynamicString({ queryRef, ...props }: Props) {
  const data = useFragment(DynamicString$fragment, queryRef);
  return <Text {...props}>{data.value}</Text>;
}

export type { Props as DynamicStringProps };
