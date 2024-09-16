import { Text } from "@/components/Text";
import { View } from "@/components/View";
import useThemeContext from "@/hooks/useTendyTheme";
import { useRouter } from "expo-router";
import { DateTime } from "luxon";
import { TouchableOpacity } from "react-native";
import { useFragment } from "react-relay";
import Avatar from "../Avatar";
import Seperator from "../Separator";
import {
  ChecklistInlineView$fragment,
  type ChecklistInlineView$key,
} from "./ChecklistInlineView";

interface Props {
  queryRef: ChecklistInlineView$key;
  completed: boolean;
}

export function ChecklistInlineView({ queryRef, completed }: Props) {
  const data = useFragment(ChecklistInlineView$fragment, queryRef);
  const { colors } = useThemeContext();

  const router = useRouter();

  if (completed && !(data.status?.__typename === "ChecklistClosed")) {
    return;
  }

  return (
    <View
      style={{
        padding: 4,
        margin: 2,
        borderLeftWidth: completed ? 0 : 5,
        borderRadius: 5,
        borderColor: completed ? undefined : colors.feedback.error.button1,
        flex: 1,
        backgroundColor: colors.tendrel.background2.color,
      }}
    >
      <TouchableOpacity onPress={() => router.navigate("/(home)/work")}>
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
              // TODO: move to the shared library
              firstName={
                data.assignees.edges[0].node.assignedTo.firstName ??
                "Unassigned"
              }
              lastName={
                data.assignees.edges[0].node.assignedTo.lastName ?? undefined
              }
              size={25}
            />
            <Text>
              {data.assignees.edges.at(0)?.node.assignedTo.displayName ??
                "Unassigned"}
            </Text>
          </View>
        </View>
        <Seperator orientation="horizontal" width={0.5} />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ flex: 1 }}>Previous: 08/01/24 13:31</Text>
          <Text>
            {DateTime.now().toLocaleString(DateTime.DATE_SHORT)}
            {/*
            TODO: Make real

            {data.status.openedAt?.epochMilliseconds
              ? new Date(
                  Number(data.status.openedAt.epochMilliseconds),
                ).toLocaleString()
              : null} */}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
