import type { EditChecklistModalMutation } from "@/__generated__/EditChecklistModalMutation.graphql";
import type { EditChecklistModalQuery } from "@/__generated__/EditChecklistModalQuery.graphql";
import type { EditChecklistModal_fragment$key } from "@/__generated__/EditChecklistModal_fragment.graphql";
import { useTheme } from "@/hooks/useTheme";
import { useEffect, useState } from "react";
import { Modal, StyleSheet } from "react-native";
import {
  type PreloadedQuery,
  graphql,
  useFragment,
  useMutation,
  usePreloadedQuery,
} from "react-relay";
import * as DropdownMenu from "zeego/dropdown-menu";
import Button from "./Button";
import { Text } from "./Text";
import { View } from "./View";

interface Assignee {
  id: string;
  name: string;
}

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

interface EditChecklistModalProps {
  checklistId: string;
  visible: boolean;
  onClose: () => void;
  queryRef: PreloadedQuery<EditChecklistModalQuery>;
  fragRef: EditChecklistModal_fragment$key;
  onSave: (newAssignee: Assignee) => void;
}

export function EditChecklistModal({
  checklistId,
  visible,
  onClose,
  queryRef,
  fragRef,
}: EditChecklistModalProps) {
  const { colors } = useTheme();

  const data = useFragment(
    graphql`
      fragment EditChecklistModal_fragment on Checklist {
        id
        assignees {
          edges {
            node {
              assignedTo {
                id
              }
            }
          }
        }
      }
    `,
    fragRef,
  );

  const [selectedAssigneeId, setSelectedAssigneeId] = useState(
    data.assignees.edges.at(0)?.node.assignedTo.id,
  );

  const assigneeData = usePreloadedQuery(AssignChecklistMenuQuery, queryRef);

  function getAssigneeName(assigneeId?: string) {
    const foundNode = assigneeData.assignable.edges.find(
      edge => edge.node.__typename === "Worker" && edge.node.id === assigneeId,
    )?.node;

    return foundNode?.__typename === "Worker"
      ? foundNode.displayName
      : undefined;
  }

  const [commit, _isInFlight] = useMutation<EditChecklistModalMutation>(
    graphql`
      mutation EditChecklistModalMutation($entity: ID!, $to: ID!) {
        assign(entity: $entity, to: $to) {
          entity {
            ... on Checklist {
              assignees {
      edges {
        node {
          ...Assignee_fragment
        }
      }
      totalCount
    }
            }
          }
        }
      }
    `,
  );

  //   const handleSave = () => {
  //     onSave(selectedAssignee);
  //     onClose();
  //   };

  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View
          style={{
            width: 300,
            padding: 20,
            backgroundColor: colors.tendrel.background1.color,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: colors.tendrel.text2.color,
            }}
          >
            Edit Assignee
          </Text>
          <DropdownMenu.Root style={{ padding: 4 }}>
            <DropdownMenu.Trigger asChild>
              <Button
                disabled={!!selectedAssigneeId}
                title={getAssigneeName(selectedAssigneeId) ?? "Select a worker"}
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              loop
              side="bottom"
              align="start"
              sideOffset={5}
              alignOffset={0}
              avoidCollisions
              collisionPadding={8}
            >
              <DropdownMenu.Label>{"Select a worker"}</DropdownMenu.Label>
              {assigneeData.assignable.edges.map(edge => {
                const assignee = edge.node;
                if (assignee.__typename !== "Worker") return null;

                return (
                  <DropdownMenu.Item
                    key={assignee.id}
                    onSelect={() => setSelectedAssigneeId(assignee.id)}
                  >
                    {assignee.displayName}
                  </DropdownMenu.Item>
                );
              })}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <View style={styles.buttonContainer}>
            <Button
              // TODO: these colors are just grey and not very visible in dark mode, we need to change the color style
              color={colors.tendrel.button1.color}
              title="Cancel"
              onPress={onClose}
            />
            <Button
              // TODO: these colors are just grey and not very visible in dark mode, we need to change the color style
              color={colors.tendrel.button1.color}
              title="Save"
              onPress={() => {
                if (selectedAssigneeId) {
                  commit({
                    variables: { entity: checklistId, to: selectedAssigneeId },
                    onCompleted: () => {
                      onClose();
                    },
                    onError: () => {},
                  });
                }
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
