import type { ChecklistResultInlineViewSetValueMutation } from "@/__generated__/ChecklistResultInlineViewSetValueMutation.graphql";
import { useTheme } from "@/hooks/useTheme";
import { CheckCircleIcon, CircleIcon } from "lucide-react-native";
import { graphql, useFragment, useMutation } from "react-relay";
import { match } from "ts-pattern";
import { View } from "../View";
import { CheckboxWidget } from "./CheckboxWidget.native";
import {
  ChecklistResultInlineView$fragment,
  type ChecklistResultInlineView$key,
} from "./ChecklistResultInlineView";
import { ClickerWidget } from "./ClickerWidget.native";
import { DisplayName } from "./DisplayName.native";
import { MultilineStringWidget } from "./MultilineStringWidget.native";
import { NumberWidget } from "./NumberWidget.native";
import { SentimentWidget } from "./SentimentWidget.native";
import { StringWidget } from "./StringWidget.native";

interface Props {
  parent: string;
  queryRef: ChecklistResultInlineView$key;
  readOnly?: boolean;
}

export function ChecklistResultInlineView({ queryRef, ...props }: Props) {
  const data = useFragment(ChecklistResultInlineView$fragment, queryRef);

  const [commit, _isInFlight] =
    useMutation<ChecklistResultInlineViewSetValueMutation>(
      graphql`
        mutation ChecklistResultInlineViewSetValueMutation(
          $entity: ID!
          $parent: ID!
          $statusInput: ChecklistStatusInput!
          $valueInput: WidgetInput!
        ) {
          setValue(entity: $entity, parent: $parent, input: $valueInput) {
            node {
              id
              ...ChecklistResultInlineView_fragment
            }
          }

          setStatus(entity: $entity, parent: $parent, input: $statusInput) {
            ... on SetChecklistItemStatusPayload {
              edge {
                cursor
                node {
                  ...ChecklistResultInlineView_fragment
                }
              }
              parent {
                ...ChecklistProgressBar_fragment
              }
            }
          }
        }
      `,
    );

  const { colors } = useTheme();

  return (
    <View
      style={{
        marginVertical: 4,
        marginHorizontal: 6,
        padding: 10,
        borderRadius: 5,
        backgroundColor: colors.tendrel.background1.color,
        borderLeftColor: (() => {
          // FIXME: We can probably do better than this. But this is good enough
          // for now...
          switch (data.status?.__typename) {
            case "ChecklistOpen": {
              if (data.status.dueAt) {
                const due = Number(data.status.dueAt.epochMilliseconds);
                const now = Date.now();
                if (due < now) return colors.feedback.error.button2;
              }
              return colors.tendrel.button2.gray;
            }
            case "ChecklistInProgress": {
              if (data.status.dueAt) {
                const due = Number(data.status.dueAt.epochMilliseconds);
                const now = Date.now();
                if (due < now) return colors.feedback.error.button2;
              }
              return colors.tendrel.button2.gray;
            }
            case "ChecklistClosed": {
              if (data.status.closedBecause?.code === "error") {
                return colors.feedback.error.button2;
              }
              return colors.feedback.success.button2;
            }
            default:
              return data.required
                ? colors.feedback.error.button2
                : colors.tendrel.button2.gray;
          }
        })(),
        borderLeftWidth: 5,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <DisplayName queryRef={data.name} style={{ flex: 1 }} />
        {match(data.status?.__typename)
          .with("ChecklistOpen", () => (
            <CircleIcon color={colors.tendrel.border2.gray} />
          ))
          .with("ChecklistClosed", () => (
            <CheckCircleIcon color={colors.feedback.success.button2} />
          ))
          .otherwise(() => null)}
      </View>
      {match(data.widget)
        .with({ __typename: "CheckboxWidget" }, node => (
          <CheckboxWidget
            readOnly={props.readOnly}
            readerFragmentRef={node}
            writerFragmentRef={node}
            onCommit={value => {
              commit({
                variables: {
                  entity: data.id,
                  parent: props.parent,
                  statusInput: {
                    closed: {
                      at: {
                        instant: Date.now().toString(),
                      },
                    },
                  },
                  valueInput: {
                    checkbox: { value },
                  },
                },
              });
            }}
          />
        ))
        .with({ __typename: "ClickerWidget" }, node => (
          <ClickerWidget
            readOnly={props.readOnly}
            readerFragmentRef={node}
            writerFragmentRef={node}
            onCommit={value => {
              commit({
                variables: {
                  entity: data.id,
                  parent: props.parent,
                  statusInput: {
                    closed: {
                      at: {
                        instant: Date.now().toString(),
                      },
                    },
                  },
                  valueInput: {
                    clicker: { value },
                  },
                },
              });
            }}
          />
        ))
        .with({ __typename: "MultilineStringWidget" }, node => (
          <MultilineStringWidget
            readOnly={props.readOnly}
            readerFragmentRef={node}
            writerFragmentRef={node}
          />
        ))
        .with({ __typename: "NumberWidget" }, node => (
          <NumberWidget
            readOnly={props.readOnly}
            readerFragmentRef={node}
            writerFragmentRef={node}
            onCommit={value => {
              commit({
                variables: {
                  entity: data.id,
                  parent: props.parent,
                  statusInput: {
                    closed: {
                      at: {
                        instant: Date.now().toString(),
                      },
                    },
                  },
                  valueInput: {
                    number: { value },
                  },
                },
              });
            }}
          />
        ))
        .with({ __typename: "SentimentWidget" }, node => (
          <SentimentWidget
            readOnly={props.readOnly}
            readerFragmentRef={node}
            writerFragmentRef={node}
            onCommit={value => {
              commit({
                variables: {
                  entity: data.id,
                  parent: props.parent,
                  statusInput: {
                    closed: {
                      at: {
                        instant: Date.now().toString(),
                      },
                    },
                  },
                  valueInput: {
                    number: { value },
                  },
                },
              });
            }}
          />
        ))
        .with({ __typename: "StringWidget" }, node => (
          <StringWidget
            readOnly={props.readOnly}
            readerFragmentRef={node}
            writerFragmentRef={node}
          />
        ))
        .with({ __typename: "TemporalWidget" }, _node => null)
        .otherwise(() => null)}
    </View>
  );
}
