import type { EditChecklistModalMutation } from "@/__generated__/EditChecklistModalMutation.graphql";
import type { EditChecklistModalQuery } from "@/__generated__/EditChecklistModalQuery.graphql";
import type { EditChecklistModalUnassignMutation } from "@/__generated__/EditChecklistModalUnassignMutation.graphql";
import type { EditChecklistModal_fragment$key } from "@/__generated__/EditChecklistModal_fragment.graphql";
import { useTheme } from "@/hooks/useTheme";
import { SquarePen } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import {
  type PreloadedQuery,
  graphql,
  useFragment,
  useMutation,
  usePreloadedQuery,
} from "react-relay";
import * as DropdownMenu from "zeego/dropdown-menu";
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

interface EditChecklistModalProps {
  checklistId: string;
  onClose: () => void;
  queryRef: PreloadedQuery<EditChecklistModalQuery>;
  fragRef: EditChecklistModal_fragment$key;
}

export function EditChecklistModal({
  checklistId,
  onClose,
  queryRef,
  fragRef,
}: EditChecklistModalProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

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

  const currentAssignee = data.assignees.edges.at(0)?.node.assignedTo.id;

  const assigneeData = usePreloadedQuery(AssignChecklistMenuQuery, queryRef);

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
  const [commitUnassign, _isInFlight2] =
    useMutation<EditChecklistModalUnassignMutation>(
      graphql`
    mutation EditChecklistModalUnassignMutation($entity: ID!, $from: ID!) {
      unassign(entity: $entity, from: $from) {
        entity {
          ... on Checklist {
            assignees {
              edges {
                node {
                  ...Assignee_fragment
                }
              }
            }
          }
        }
      }
    }
    `,
    );

  return (
    <DropdownMenu.Root
      style={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <DropdownMenu.Trigger asChild>
        <TouchableOpacity>
          <SquarePen color={colors.tendrel.text1.color} />
        </TouchableOpacity>
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
        <DropdownMenu.Label>
          {t("editChecklist.selectWorker.t")}
        </DropdownMenu.Label>
        {currentAssignee ? (
          <DropdownMenu.Item
            key="unassignId"
            onSelect={() => {
              commitUnassign({
                variables: { entity: checklistId, from: currentAssignee },
                onCompleted: () => {
                  onClose();
                },
                onError: () => {},
              });
            }}
          >
            <DropdownMenu.ItemIcon
              ios={{ name: "person.crop.circle.badge.minus" }}
              androidIconName="ic_delete"
            />
            <DropdownMenu.ItemTitle>
              {t("editChecklist.unassign.t")}
            </DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
        ) : undefined}

        {assigneeData.assignable.edges.map(edge => {
          const assignee = edge.node;
          if (assignee.__typename !== "Worker") return null;
          return (
            <DropdownMenu.CheckboxItem
              key={assignee.id}
              value={currentAssignee === assignee.id}
              onValueChange={() => {
                commit({
                  variables: { entity: checklistId, to: assignee.id },
                  onCompleted: () => {
                    onClose();
                  },
                  onError: () => {},
                });
              }}
            >
              <DropdownMenu.ItemTitle>
                {assignee.displayName}
              </DropdownMenu.ItemTitle>
            </DropdownMenu.CheckboxItem>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
