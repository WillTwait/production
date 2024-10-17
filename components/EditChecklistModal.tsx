import type { EditChecklistModalMutation } from "@/__generated__/EditChecklistModalMutation.graphql";
import type { EditChecklistModalQuery } from "@/__generated__/EditChecklistModalQuery.graphql";
import type { EditChecklistModalUnassignMutation } from "@/__generated__/EditChecklistModalUnassignMutation.graphql";
import type { EditChecklistModal_fragment$key } from "@/__generated__/EditChecklistModal_fragment.graphql";
import { useTheme } from "@/hooks/useTheme";
import { SquarePen } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import {
  type PreloadedQuery,
  graphql,
  useFragment,
  useMutation,
  usePreloadedQuery,
} from "react-relay";
import * as DropdownMenu from "zeego/dropdown-menu";

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
  assignable: PreloadedQuery<EditChecklistModalQuery>;
  checklistId: string;
  cx: EditChecklistModal_fragment$key;
  onClose: () => void;
}

export function EditChecklistModal({
  checklistId,
  cx,
  onClose,
  ...props
}: EditChecklistModalProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

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
    cx,
  );

  const currentAssignee = data.edges.at(0)?.node.assignedTo.id;

  const { assignable } = usePreloadedQuery(
    AssignChecklistMenuQuery,
    props.assignable,
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
    <DropdownMenu.Root
      style={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <DropdownMenu.Trigger asChild>
        <TouchableOpacity disabled={isAssignInFlight || isUnassignInFlight}>
          {isAssignInFlight || isUnassignInFlight ? (
            <ActivityIndicator />
          ) : (
            <SquarePen color={colors.tendrel.text1.color} />
          )}
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
              unassign({
                variables: {
                  connections: [data.__id],
                  entity: checklistId,
                  from: currentAssignee,
                },
                // updater(store, data) {
                //   // FIXME: I'm not sure why @deleteEdge isn't working.
                //   // As a workaround, we do it manually:
                //   const cx = store.get(connectionId);
                //   const from = data?.unassign.unassignedAssignees ?? [];
                //   if (cx) {
                //     for (const id of from) {
                //       ConnectionHandler.deleteNode(cx, id);
                //     }
                //     cx.setValue(0, "totalCount");
                //   }
                // },
                onCompleted: onClose,
                onError(e) {
                  console.debug("ERROR", e);
                },
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

        {assignable.edges.map(edge => {
          const assignee = edge.node;
          if (assignee.__typename !== "Worker") return null;
          return (
            <DropdownMenu.CheckboxItem
              key={assignee.id}
              value={currentAssignee === assignee.id}
              onValueChange={() => {
                assign({
                  variables: {
                    connections: [data.__id],
                    entity: checklistId,
                    to: assignee.id,
                  },
                  onCompleted: onClose,
                  onError(e) {
                    console.debug("ERROR", e);
                  },
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
