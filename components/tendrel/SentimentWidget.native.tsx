import type { SentimentWidgetInput } from "@/__generated__/ChecklistResultInlineViewSetValueMutation.graphql";
import { useTheme } from "@/hooks/useTheme";
import { Star } from "lucide-react-native";
import { useCallback } from "react";
import {
  commitLocalUpdate,
  useFragment,
  useRelayEnvironment,
} from "react-relay";
import { View } from "../View";
import {
  ReaderFragment,
  type ReaderFragmentRef,
  WriterFragment,
  type WriterFragmentRef,
} from "./SentimentWidget";

type Props =
  | {
      readOnly: true;
      readerFragmentRef: ReaderFragmentRef;
    }
  | {
      readOnly?: false;
      readerFragmentRef: ReaderFragmentRef;
      writerFragmentRef: WriterFragmentRef;
      onCommit: (input: { sentiment: SentimentWidgetInput }) => void;
    };

export function SentimentWidget(props: Props) {
  const data = useFragment(ReaderFragment, props.readerFragmentRef);
  const environment = useRelayEnvironment();
  const { colors } = useTheme();

  const getStarColor = useCallback(
    (star: number) => {
      return (data.number ?? 0) >= star
        ? colors.tendrel.text2.color
        : colors.tendrel.interactive3.gray;
    },
    [colors, data.number],
  );

  if (props.readOnly) {
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {[1, 2, 3].map(star => (
          <Star
            fill={getStarColor(star)}
            color={getStarColor(star)}
            key={star}
          />
        ))}
      </View>
    );
  }

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {[1, 2, 3].map(star => (
        <Star
          onPress={() => {
            commitLocalUpdate(environment, store => {
              const { updatableData } = store.readUpdatableFragment(
                WriterFragment,
                props.writerFragmentRef,
              );

              updatableData.number = star;
            });
            props.onCommit({ sentiment: { value: star } });
          }}
          size={50}
          color={getStarColor(star)}
          fill={getStarColor(star)}
          key={star}
        />
      ))}
    </View>
  );
}
