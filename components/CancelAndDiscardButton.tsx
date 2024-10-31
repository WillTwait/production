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
      mutation CancelAndDiscardButtonMutation(
        $entity: ID!
        $input: ChecklistStatusInput!
      ) {
        setStatus(entity: $entity, input: $input) {
          ... on SetChecklistStatusPayload {
            edge {
              node {
                id
              }
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
          variables: {
            entity: node,
            input: {
              closed: {
                at: {
                  instant: Date.now().toString(),
                },
                because: {
                  code: "cancel",
                },
              },
            },
          },
          updater(store) {
            const root = store.getRoot();
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
