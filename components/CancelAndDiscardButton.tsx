import type { CancelAndDiscardButtonMutation } from "@/__generated__/CancelAndDiscardButtonMutation.graphql";
import { useTheme } from "@/hooks/useTheme";
import ConnectionHandler from "@/relay/ConnectionHandler";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { graphql, useMutation } from "react-relay";
import Button from "./Button";

interface Props {
  node: string;
}

export function CancelAndDiscardButton({ node }: Props) {
  const router = useRouter();
  const { colors, colorTheme } = useTheme();
  const { t } = useTranslation();

  const [commit, isInFlight] = useMutation<CancelAndDiscardButtonMutation>(
    graphql`
      mutation CancelAndDiscardButtonMutation($id: ID!) {
        discardChecklist(entity: $id) {
            edge {
              cursor
              node {
                ...ChecklistInlineView
              }
            }
          }
        }
    `,
  );

  return (
    <Button
      disabled={isInFlight}
      title={t("workScreen.cancelAndDiscard.t")}
      variant="filled"
      color={colors.tendrel.button1.gray}
      textColor={colorTheme === "dark" ? colors.tendrel.text2.color : undefined}
      onPress={() => {
        commit({
          variables: { id: node },
          updater(store) {
            const root = store.getRoot();
            const payload = store.getRootField("discardChecklist");
            const edge = payload.getLinkedRecord("edge");

            const cxInto = ConnectionHandler.getConnections(
              root,
              // @see ActiveConnectionView.tsx
              "ActiveConnectionView__checklists",
              // Only update the active view when the active view is rendering
              // open checklists.
              variables => variables.withStatus?.includes("open"),
            );

            for (const cx of cxInto) {
              ConnectionHandler.insertEdgeBefore(cx, edge);
            }

            const cxFrom = ConnectionHandler.getConnection(
              root,
              // @see AlternateConnectionView.tsx
              "AlternateConnectionView__checklists",
            );

            if (!cxFrom) return;

            ConnectionHandler.deleteNode(cxFrom, node);
            const totalCount = cxFrom.getValue("totalCount") as number;
            cxFrom.setValue(totalCount - 1, "totalCount");
          },
          onCompleted: () => {
            router.navigate("/");
          },
          onError: () => {
            // TODO: pop up toast?
          },
        });
      }}
    />
  );
}
