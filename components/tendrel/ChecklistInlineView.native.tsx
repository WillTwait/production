import type { EditChecklistModalQuery } from "@/__generated__/EditChecklistModalQuery.graphql";
import { Text } from "@/components/Text";
import { View } from "@/components/View";
import { useTheme } from "@/hooks/useTheme";
import { nullish } from "@/util/nullish";
import { useRouter } from "expo-router";
import { PencilOff, TimerIcon } from "lucide-react-native";
import { Suspense, useCallback, useRef } from "react";
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
  const [queryRef, loadQuery] = useQueryLoader<EditChecklistModalQuery>(
    AssignChecklistMenuQuery,
  );

  const swipableRef = useRef<Swipeable>(null);
  const { colors } = useTheme();
  const router = useRouter();

  // FIXME: this and the the swipeable should maybe be moved up to the flatlist if possible? or maybe pass a flatlist ref down so that we can close other items when a new swipe is made
  const renderRightActions = useCallback(
    () => (
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
          <Suspense fallback={<ActivityIndicator />}>
            <EditChecklistModal
              assignable={queryRef}
              checklistId={data.id}
              cx={data.assignees}
              onClose={() => swipableRef.current?.close()}
            />
          </Suspense>
        ) : (
          <ActivityIndicator />
        )}
      </View>
    ),
    [colors, data, queryRef],
  );

  return (
    <Swipeable
      ref={swipableRef}
      onSwipeableWillOpen={() => loadQuery({ entity: data.id })}
      renderRightActions={renderRightActions}
      useNativeAnimations
      enabled={data.status?.__typename === "ChecklistOpen"}
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
                // FIXME: temporary hack until we figure out how to deal with On - Demand (should not be overdue)
                // i think this means we need to send data.type === "OnDemand" or something

                // if (data.status.dueAt?.epochMilliseconds) {
                //   const dueAt = Number(data.status.dueAt.epochMilliseconds);
                //   const now = Date.now();
                //   if (dueAt < now) return colors.feedback.error.button2;
                // }
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
                switch (data.status.closedBecause?.code) {
                  case "cancel":
                    return colors.tendrel.button2.gray;
                  case "error":
                    return colors.feedback.error.button2;
                  default:
                    return colors.tendrel.background2.color;
                }
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
              {data.assignees.edges.map(e => (
                <Assignee key={e.node.id} queryRef={e.node} />
              ))}
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
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.tendrel.text1.gray,
                        }}
                      >
                        {data.status.closedBecause?.code === "cancel"
                          ? "Cancelled"
                          : "Completed"}{" "}
                        on:
                      </Text>
                      <Temporal
                        queryRef={data.status.closedAt}
                        options={{ dateStyle: "short", timeStyle: "short" }}
                        style={{
                          fontSize: 12,
                          color: colors.tendrel.text1.gray,
                        }}
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
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.tendrel.text1.gray,
                        }}
                      >
                        Started:
                      </Text>
                      <Temporal
                        queryRef={data.status.inProgressAt}
                        options={{ dateStyle: "short", timeStyle: "short" }}
                        style={{
                          fontSize: 12,
                          color: colors.tendrel.text1.gray,
                        }}
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
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.tendrel.text1.gray,
                        }}
                      >
                        Previous:
                      </Text>
                      <Temporal
                        queryRef={data.parent.status.closedAt}
                        options={{ dateStyle: "short", timeStyle: "short" }}
                        style={{
                          fontSize: 12,
                          color: colors.tendrel.text1.gray,
                        }}
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
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.tendrel.text1.gray,
                        }}
                      >
                        Open since:
                      </Text>
                      <Temporal
                        queryRef={data.status.openedAt}
                        options={{ dateStyle: "short", timeStyle: "short" }}
                        style={{
                          fontSize: 12,
                          color: colors.tendrel.text1.gray,
                        }}
                      />
                    </View>
                  );
              }
            })()}
            {(() => {
              if (!data.status) return null;

              // If it's open with a due date, show the due date.

              // FIXME: similar to fixme above, but removing this for now until we get frequency working / deal with on demands
              // if (data.status.openedAt && data.status.dueAt) {
              //   return (
              //     <DueAt
              //       iconSize={12}
              //       queryRef={data.status}
              //       style={{ fontSize: 12, color: colors.tendrel.text1.color }}
              //     />
              //   );
              // }

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
                    <TimerIcon size={12} color={colors.tendrel.text1.color} />
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
