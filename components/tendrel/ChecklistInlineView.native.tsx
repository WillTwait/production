import { Text } from "@/components/Text";
import { View } from "@/components/View";
import useThemeContext from "@/hooks/useTendyTheme";
import { useFragment } from "react-relay";
import Avatar from "../Avatar";
import Seperator from "../Separator";
import {
  ChecklistInlineView$fragment,
  type ChecklistInlineView$key,
} from "./ChecklistInlineView";

interface Props {
  queryRef: ChecklistInlineView$key;
}

export function ChecklistInlineView(props: Props) {
  const data = useFragment(ChecklistInlineView$fragment, props.queryRef);
  const { colors } = useThemeContext();
  return (
    <View
      style={{
        padding: 4,
        margin: 2,
        borderLeftWidth: 5,
        borderColor: colors.feedback.error.background,
        flex: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text type="title" style={{ flex: 1 }}>
          {data.name.value.value}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Avatar
            //TODO: move to the shared library
            firstName={
              data.assignees.edges[0].node.assignedTo.user.firstName ??
              "Unassigned"
            }
            lastName={
              data.assignees.edges[0].node.assignedTo.user.lastName ?? undefined
            }
            size={25}
          />
          <Text>
            {data.assignees.edges.at(0)?.node.assignedTo.user.displayName ??
              "Unassigned"}
          </Text>
        </View>
      </View>
      <Seperator orientation="horizontal" width={0.5} />
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ flex: 1 }}>Previous: 08/01/24 13:31</Text>
        <Text>
          {data.status.openedAt?.epochMilliseconds
            ? new Date(
                Number(data.status.openedAt.epochMilliseconds),
              ).toLocaleString()
            : null}
        </Text>
      </View>
    </View>
  );
}
