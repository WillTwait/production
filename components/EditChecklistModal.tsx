import type { EditChecklistModalMutation } from "@/__generated__/EditChecklistModalMutation.graphql";
import type { EditChecklistModalUnassignMutation } from "@/__generated__/EditChecklistModalUnassignMutation.graphql";
import { useTheme } from "@/hooks/useTheme";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import ActionSheet, {
  SheetManager,
  type SheetProps,
} from "react-native-actions-sheet";
import DropDownPicker from "react-native-dropdown-picker";
import {
  graphql,
  useFragment,
  useMutation,
  usePreloadedQuery,
} from "react-relay";
import { Text } from "./Text";
import { View } from "./View";

export const AssignChecklistMenuQuery = graphql`
  query EditChecklistModalQuery($entity: ID!) {
    assignable(entity: $entity) {
      edges {
        node {
          __typename
          ... on Worker {
            id
            displayName
            scanCode
          }
        }
      }
      totalCount
    }
  }
`;

export function EditChecklistModal({
  payload,
}: SheetProps<"edit-checklist-sheet">) {
  const { colors, colorTheme } = useTheme();
  const { t } = useTranslation();
  const [assignSelectOpen, setAssignSelectOpen] = useState(false);

  if (!payload) {
    return null;
  }

  const data = useFragment(
    graphql`
      fragment EditChecklistModal_fragment on AssigneeConnection {
        __id
        edges {
          node {
            assignedTo {
              id
            }
          }
        }
      }
    `,
    payload.cx,
  );

  const currentAssignee = data?.edges.at(0)?.node.assignedTo.id;

  const { assignable } = usePreloadedQuery(
    AssignChecklistMenuQuery,
    payload.assignable,
  );

  const [assign, isAssignInFlight] = useMutation<EditChecklistModalMutation>(
    graphql`
      mutation EditChecklistModalMutation(
        $entity: ID!
        $to: ID!
        $connections: [ID!]!
      ) {
        assign(entity: $entity, to: $to) {
          assignee @appendEdge(connections: $connections) {
            cursor
            node {
              id
              ...Assignee_fragment
            }
          }
        }
      }
    `,
  );
  const [unassign, isUnassignInFlight] =
    useMutation<EditChecklistModalUnassignMutation>(
      graphql`
        mutation EditChecklistModalUnassignMutation(
          $entity: ID!
          $from: ID!
          $connections: [ID!]!
        ) {
          unassign(entity: $entity, from: $from) {
            unassignedAssignees @deleteEdge(connections: $connections)
          }
        }
      `,
    );

  return (
    <ActionSheet
      containerStyle={{
        height: "60%",
        backgroundColor: colors.tendrel.background1.color,
      }}
      onClose={payload.onClose}
      headerAlwaysVisible
      CustomHeaderComponent={
        <View
          style={{
            alignItems: "flex-start",
            padding: 10,
            flexDirection: "row",
            borderBottomWidth: 0.5,
            borderBottomColor: colors.tendrel.border2.gray,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 18, flex: 1 }}>
            {t("editChecklist.editChecklist.t")}
          </Text>
          <TouchableOpacity
            onPress={() => SheetManager.hide("edit-checklist-sheet")}
          >
            <X color={colors.tendrel.button1.gray} size={18} />
          </TouchableOpacity>
        </View>
      }
    >
      <View
        style={{
          padding: 10,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold", padding: 5 }}>
          {t("editChecklist.assignee.t")}
        </Text>
        <DropDownPicker
          open={assignSelectOpen}
          value={currentAssignee ?? null}
          disabled={isAssignInFlight || isUnassignInFlight}
          items={assignable.edges.flatMap(({ node }) =>
            node.__typename !== "Worker"
              ? []
              : { label: node.displayName, value: node.id },
          )}
          style={{ borderColor: colors.tendrel.border1.color }}
          dropDownContainerStyle={{ borderColor: colors.tendrel.border1.color }}
          searchTextInputStyle={{ borderColor: colors.tendrel.border1.color }}
          labelProps={{ style: { color: colors.tendrel.text2.color } }}
          searchContainerStyle={{
            borderBottomColor: colors.tendrel.border1.color,
          }}
          TickIconComponent={() => (
            <Check color={colors.tendrel.button2.color} />
          )}
          ArrowUpIconComponent={() => (
            <ChevronUp color={colors.tendrel.button1.color} />
          )}
          ArrowDownIconComponent={() => (
            <ChevronDown color={colors.tendrel.button1.color} />
          )}
          setOpen={setAssignSelectOpen}
          searchable
          searchPlaceholder={t("editChecklist.searchForWorker.t")}
          placeholder={t("editChecklist.selectWorker.t")}
          addCustomItem={false}
          ListEmptyComponent={() => (
            <View style={{ padding: 5 }}>
              <Text>{t("editChecklist.noWorkers.t")}</Text>
            </View>
          )}
          theme={colorTheme === "dark" ? "DARK" : "LIGHT"}
          setValue={() => {}}
          onSelectItem={val => {
            if (val.value === currentAssignee) {
              unassign({
                variables: {
                  connections: [data.__id],
                  entity: payload.checklistId,
                  from: currentAssignee ?? "1",
                },
                onError(e) {
                  console.debug("ERROR", e);
                },
              });
              return;
            }

            assign({
              variables: {
                connections: [data.__id],
                entity: payload.checklistId,
                to: val.value ?? "",
              },

              onError(e) {
                console.debug("ERROR", e);
              },
            });
          }}
          multiple={false}
        />
      </View>
    </ActionSheet>
  );
}
