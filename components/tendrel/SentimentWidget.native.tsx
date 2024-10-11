import { useDebounce } from "@/hooks/useDebounce";
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
      onCommit: (value: number | null) => void;
    };

export function SentimentWidget(props: Props) {
  const data = useFragment(ReaderFragment, props.readerFragmentRef);
  const environment = useRelayEnvironment();

  const { colors } = useTheme();

  const getStarColor = (star: number, rating: number) => {
    if (rating >= star) {
      return colors.tendrel.text2.color;
    }
    return colors.tendrel.interactive3.gray;
  };

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
            fill={getStarColor(star, data.number ?? 0)}
            color={getStarColor(star, data.number ?? 0)}
            key={star}
          />
        ))}
      </View>
    );
  }

  const { writerFragmentRef, onCommit } = props;
  const onChange = useCallback(
    (star: number) => {
      commitLocalUpdate(environment, store => {
        const { updatableData } = store.readUpdatableFragment(
          WriterFragment,
          writerFragmentRef,
        );

        updatableData.number = star;
      });

      onCommit(star);
    },
    [environment, onCommit, writerFragmentRef],
  );

  const { value, setValue } = useDebounce(onChange, {
    debounceMs: 200,
    initialValue: data.number ?? 0,
  });

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
          onPress={() => setValue(star)}
          size={50}
          color={getStarColor(star, value)}
          fill={getStarColor(star, value)}
          key={star}
        />
      ))}
    </View>
  );
}
