import type { EditChecklistModalQuery } from "@/__generated__/EditChecklistModalQuery.graphql";
import { Text } from "@/components/Text";
import { View } from "@/components/View";
import { useTheme } from "@/hooks/useTheme";
import { nullish } from "@/util/nullish";
import { useRouter } from "expo-router";
import { PencilOff, TimerIcon } from "lucide-react-native";
import { useRef } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useFragment, useQueryLoader } from "react-relay";
import {
  AssignChecklistMenuQuery,
  EditChecklistModal,
} from "../EditChecklistModal";
import Seperator from "../Separator";
import { Assignee } from "./Assignee.native";
import {
  ChecklistInlineView$fragment,
  type ChecklistInlineView$key,
} from "./ChecklistInlineView";
import { ChecklistTimer } from "./ChecklistTimer.native";
import { DisplayName } from "./DisplayName.native";
import { DueAt } from "./DueAt.native";
import { Temporal } from "./Temporal.native";

interface Props {
  queryRef: ChecklistInlineView$key;
}

export function ChecklistInlineView({ queryRef: fragRef }: Props) {
  const data = useFragment(ChecklistInlineView$fragment, fragRef);

  const swipableRef = useRef<Swipeable>(null);

  const { colors } = useTheme();
  const router = useRouter();

  const [queryRef, loadQuery, disposeQuery] =
    useQueryLoader<EditChecklistModalQuery>(AssignChecklistMenuQuery);

  // FIXME: this and the the swipeable should maybe be moved up to the flatlist if possible? or maybe pass a flatlist ref down so that we can close other items when a new swipe is made
  const renderRightActions = () => (
    <View
      style={{
        width: 75,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.tendrel.interactive2.color,
        borderRadius: 5,
        margin: 2,
      }}
    >
      {data.status?.__typename !== "ChecklistOpen" ? (
        // only allow assigning for "open" checklists
        <PencilOff color={colors.tendrel.text1.color} />
      ) : queryRef ? (
        <EditChecklistModal
          checklistId={data.id}
          onClose={() => {
            disposeQuery();
            swipableRef.current?.close();
          }}
          queryRef={queryRef}
          fragRef={data}
        />
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );

  return (
    <Swipeable
      ref={swipableRef}
      onBegan={() => loadQuery({ entity: data.id })}
      renderRightActions={renderRightActions}
      useNativeAnimations
    >
      <View
        style={{
          padding: 8,
          margin: 2,
          flex: 1,
          backgroundColor: colors.tendrel.background2.color,
          borderLeftWidth: 5,
          borderRadius: 5,
          borderColor: (() => {
            switch (data.status?.__typename) {
              case "ChecklistOpen": {
                if (data.status.dueAt?.epochMilliseconds) {
                  const dueAt = Number(data.status.dueAt.epochMilliseconds);
                  const now = Date.now();
                  if (dueAt < now) return colors.feedback.error.button1;
                }
                return colors.tendrel.button2.gray;
              }
              case "ChecklistInProgress": {
                if (data.status.dueAt?.epochMilliseconds) {
                  const dueAt = Number(data.status.dueAt.epochMilliseconds);
                  const now = Date.now();
                  if (dueAt < now) return colors.feedback.error.button1;
                }
                return colors.feedback.caution.button2;
              }
              case "ChecklistClosed": {
                if (data.status.closedBecause?.code === "error") {
                  return colors.feedback.error.button2;
                }
                return colors.feedback.success.button2;
              }
              default:
                return undefined;
            }
          })(),
        }}
      >
        <TouchableOpacity
          onPress={() =>
            router.navigate({
              pathname: "/checklist/[checklist]",
              params: { checklist: data.id },
            })
          }
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <DisplayName
              queryRef={data.name}
              type="title"
              style={{ flex: 1 }}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 5,
              }}
            >
              {data.assignees.edges.length ? (
                <Assignee queryRef={data.assignees.edges[0].node} />
              ) : null}
            </View>
          </View>
          <Seperator orientation="horizontal" width={0.5} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {(() => {
              if (!data.status) {
                return null;
              }

              switch (true) {
                case nullish(data.status.closedAt) === false:
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Text style={{ fontSize: 12, color: "gray" }}>
                        Completed on:
                      </Text>
                      <Temporal
                        queryRef={data.status.closedAt}
                        options={{ dateStyle: "short", timeStyle: "short" }}
                        style={{ fontSize: 12, color: "gray" }}
                      />
                    </View>
                  );
                case nullish(data.status.inProgressAt) === false:
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Text style={{ fontSize: 12, color: "gray" }}>
                        Started:
                      </Text>
                      <Temporal
                        queryRef={data.status.inProgressAt}
                        options={{ dateStyle: "short", timeStyle: "short" }}
                        style={{ fontSize: 12, color: "gray" }}
                      />
                    </View>
                  );
                case nullish(data.parent?.status?.closedAt) === false:
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Text style={{ fontSize: 12, color: "gray" }}>
                        Previous:
                      </Text>
                      <Temporal
                        queryRef={data.parent.status.closedAt}
                        options={{ dateStyle: "short", timeStyle: "short" }}
                        style={{ fontSize: 12, color: "gray" }}
                      />
                    </View>
                  );
                case nullish(data.status.openedAt) === false:
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Text style={{ fontSize: 12, color: "gray" }}>
                        Open since:
                      </Text>
                      <Temporal
                        queryRef={data.status.openedAt}
                        options={{ dateStyle: "short", timeStyle: "short" }}
                        style={{ fontSize: 12, color: "gray" }}
                      />
                    </View>
                  );
              }
            })()}
            {(() => {
              if (!data.status) return null;

              // If it's open with a due date, show the due date.
              if (data.status.openedAt && data.status.dueAt) {
                return (
                  <DueAt
                    iconSize={12}
                    queryRef={data.status}
                    style={{ fontSize: 12, color: "black" }}
                  />
                );
              }

              // If it's in progress, show the timer.
              if (data.status.inProgressAt) {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <TimerIcon size={12} color="black" />
                    <ChecklistTimer queryRef={data.status} />
                  </View>
                );
              }
            })()}
          </View>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
}
