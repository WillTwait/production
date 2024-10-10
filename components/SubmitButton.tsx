import type { SubmitButtonMutation } from "@/__generated__/SubmitButtonMutation.graphql";
import { useTheme } from "@/hooks/useTheme";
import ConnectionHandler from "@/relay/ConnectionHandler";
import { useTranslation } from "react-i18next";
import { graphql, useMutation } from "react-relay";
import Button from "./Button";

interface Props {
  node: string;
}

export function SubmitButton(props: Props) {
  const { colors, colorTheme } = useTheme();
  const { t } = useTranslation();

  const [commit, isInFlight] = useMutation<SubmitButtonMutation>(
    graphql`
      mutation SubmitButtonMutation($id: ID!, $input: ChecklistStatusInput!) {
        setStatus(entity: $id, input: $input) {
          ... on SetChecklistStatusPayload {
            edge {
              cursor
              node {
                ...ChecklistInlineView
                status {
                  ...ChecklistStatusButton_fragment
                }
              }
            }
          }
        }
      }
    `,
  );

  return (
    <Button
      title={t("workScreen.submit.t")}
      variant="filled"
      color={colors.tendrel.button1.color}
      textColor={colorTheme === "dark" ? colors.tendrel.text2.color : undefined}
      onPress={() => {
        commit({
          variables: {
            id: props.node,
            input: {
              closed: {
                at: {
                  instant: Date.now().toString(),
                },
              },
            },
          },
          updater(store) {
            const root = store.getRoot();

            const payload = store.getRootField("setStatus");
            const edge = payload.getLinkedRecord("edge");
            // When we transition to In Progress (presumably from Open
            // or Completed) we must ensure that we manually update the
            // corresponding connection.
            const cxInto = ConnectionHandler.getConnections(
              root,
              // @see ActiveConnectionView.tsx
              "ActiveConnectionView__checklists",
              // Only update the active view when the active view is rendering
              // closed checklists.
              variables => variables.withStatus?.includes("closed"),
            );
            for (const cx of cxInto) {
              ConnectionHandler.insertEdgeBefore(cx, edge);
              const totalCount = cx.getValue("totalCount") as number;
              cx.setValue(totalCount + 1, "totalCount");
            }

            const cxFrom = ConnectionHandler.getConnection(
              root,
              // @see AlternateConnectionView.tsx
              "AlternateConnectionView__checklists",
            );

            if (!cxFrom) return;

            ConnectionHandler.deleteNode(cxFrom, props.node);
            const totalCount = cxFrom.getValue("totalCount") as number;
            cxFrom.setValue(totalCount - 1, "totalCount");
          },
        });
      }}
      disabled={isInFlight}
    />
  );
}
