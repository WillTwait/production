import type { StartButtonMutation } from "@/__generated__/StartButtonMutation.graphql";
import { useTheme } from "@/hooks/useTheme";
import ConnectionHandler from "@/relay/ConnectionHandler";
import { Play } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import Button from "./Button";

interface Props {
  node: string;
}

export function StartButton(props: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [commit, isInFlight] = useMutation<StartButtonMutation>(
    graphql`
      mutation StartButtonMutation($id: ID!, $input: ChecklistStatusInput!) {
        setStatus(entity: $id, input: $input) {
          ... on SetChecklistStatusPayload {
            delta
            edge {
              cursor
              node {
                status {
                  ...ChecklistStatusButton_fragment
                }
                ...ChecklistInlineView
              }
            }
          }
        }
      }
    `,
  );

  return (
    <Button
      title={t("workScreen.start.t")}
      height={45}
      variant="filled"
      onPress={() =>
        commit({
          variables: {
            id: props.node,
            input: {
              inProgress: {
                at: {
                  instant: Date.now().toString(),
                },
              },
            },
          },
          updater(store) {
            const root = store.getRoot();
            // When we transition to In Progress (presumably from Open
            // or Completed) we must ensure that we manually update the
            // corresponding connection.
            const cxFrom = ConnectionHandler.getConnections(
              root,
              // @see ActiveConnectionView.tsx
              "ActiveConnectionView__checklists",
              // Only update the active view when the active view is rendering
              // open checklists.
              variables => variables.withStatus?.includes("open"),
            );
            for (const cx of cxFrom) {
              ConnectionHandler.deleteNode(cx, props.node);
            }

            const cxInto = ConnectionHandler.getConnection(
              root,
              // @see AlternateConnectionView.tsx
              "AlternateConnectionView__checklists",
            );

            if (!cxInto) return;

            const payload = store.getRootField("setStatus");
            const edge = payload.getLinkedRecord("edge");
            ConnectionHandler.insertEdgeBefore(cxInto, edge);
            const totalCount = cxInto.getValue("totalCount") as number;
            cxInto.setValue(totalCount + 1, "totalCount");
          },
        })
      }
      textColor={colors.tendrel.text2.color}
      iconAfter={<Play size={16} color={colors.tendrel.text2.color} />}
      color={colors.tendrel.interactive3.color}
      disabled={isInFlight}
    />
  );
}
