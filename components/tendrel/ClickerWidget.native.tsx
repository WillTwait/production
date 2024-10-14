import type { ClickerWidgetInput } from "@/__generated__/ChecklistResultInlineViewSetValueMutation.graphql";
import { useTheme } from "@/hooks/useTheme";
import { MinusIcon, PlusIcon } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import {
  commitLocalUpdate,
  useFragment,
  useRelayEnvironment,
} from "react-relay";
import { Text } from "../Text";
import { TextInput } from "../TextInput";
import { View } from "../View";
import {
  ReaderFragment,
  type ReaderFragmentRef,
  WriterFragment,
  type WriterFragmentRef,
} from "./ClickerWidget";

type Props =
  | {
      readOnly: true;
      readerFragmentRef: ReaderFragmentRef;
    }
  | {
      readOnly?: false;
      readerFragmentRef: ReaderFragmentRef;
      writerFragmentRef: WriterFragmentRef;
      onCommit: (input: { clicker: ClickerWidgetInput }) => void;
    };

export function ClickerWidget(props: Props) {
  const data = useFragment(ReaderFragment, props.readerFragmentRef);
  const environment = useRelayEnvironment();
  const { colors } = useTheme();

  if (props.readOnly) {
    return (
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text>{data.number?.toString() ?? "(no value)"}</Text>
      </View>
    );
  }

  const { onCommit, writerFragmentRef } = props;

  function onChange(input: number) {
    // Clickers can't go negative.
    const value = Number.isNaN(input) ? null : Math.max(0, input);
    commitLocalUpdate(environment, store => {
      const { updatableData } = store.readUpdatableFragment(
        WriterFragment,
        writerFragmentRef,
      );
      updatableData.number = value;
    });
    onCommit({ clicker: { value } });
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TouchableOpacity
        disabled={props.readOnly || (data.number ?? 0) <= 0}
        style={{
          justifyContent: "center",
          padding: 15,
        }}
        onPress={() => {
          onChange((data.number ?? 0) - 1);
        }}
      >
        <MinusIcon color={colors.tendrel.text1.color} />
      </TouchableOpacity>
      <View style={{ width: "20%" }}>
        <TextInput
          keyboardType="numeric"
          textAlign="center"
          value={data.number?.toString() ?? ""}
          onChangeText={text => onChange(Number.parseInt(text))}
        />
      </View>
      <TouchableOpacity
        style={{ justifyContent: "center", padding: 15 }}
        disabled={props.readOnly}
        onPress={() => {
          onChange((data.number ?? 0) + 1);
        }}
      >
        <PlusIcon color={colors.tendrel.text1.color} />
      </TouchableOpacity>
    </View>
  );
}
