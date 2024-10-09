import { CalendarClockIcon } from "lucide-react-native";
import { useFragment } from "react-relay";
import { Text } from "../Text";
import { View } from "../View";
import { DueAt$fragment, type DueAt$key } from "./DueAt";
import { Temporal, type TemporalVariant } from "./Temporal.native";

type Props = Omit<TemporalVariant & { variant: "distance" }, "variant"> & {
  iconSize: number;
  queryRef: DueAt$key;
};

export function DueAt({ queryRef, ...props }: Props) {
  const data = useFragment(DueAt$fragment, queryRef);

  if (data.dueAt) {
    return (
      <View
        style={{
          flexDirection: "row",
          columnGap: 4,
          alignItems: "center",
        }}
      >
        <CalendarClockIcon size={props.iconSize} style={props.style} />
        <Text style={props.style}>Due</Text>
        <Temporal variant="distance" queryRef={data.dueAt} {...props} />
      </View>
    );
  }

  return <Text>Unscheduled</Text>;
}
