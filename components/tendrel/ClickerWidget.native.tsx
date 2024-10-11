import { useDebounce } from "@/hooks/useDebounce";
import { useTheme } from "@/hooks/useTheme";
import { MinusIcon, PlusIcon } from "lucide-react-native";
import { useCallback } from "react";
import { TouchableOpacity } from "react-native";
import {
  commitLocalUpdate,
  useFragment,
  useRelayEnvironment,
} from "react-relay";
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
      onCommit: (count: number | null) => void;
    };

export function ClickerWidget(props: Props) {
  const data = useFragment(ReaderFragment, props.readerFragmentRef);
  const environment = useRelayEnvironment();
  const { colors } = useTheme();

  if (props.readOnly) {
    return (
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <View style={{ width: "20%" }}>
          <TextInput
            value={data.number?.toString() ?? ""}
            keyboardType="numeric"
            textAlign="center"
            editable={false}
          />
        </View>
      </View>
    );
  }

  const onChange = useCallback(
    (value: number | null) => {
      commitLocalUpdate(environment, store => {
        const { updatableData } = store.readUpdatableFragment(
          WriterFragment,
          props.writerFragmentRef,
        );

        updatableData.number = value;
      });
      props.onCommit(Number.isNaN(value) ? null : value);
    },
    [props.writerFragmentRef, props.onCommit, environment],
  );

  const { value, setValue } = useDebounce(onChange, {
    debounceMs: 200,
    initialValue: data.number ?? null,
  });

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
          setValue(value ?? 0 - 1);
        }}
      >
        <MinusIcon color={colors.tendrel.text1.color} />
      </TouchableOpacity>
      <View style={{ width: "20%" }}>
        <TextInput
          keyboardType="numeric"
          textAlign="center"
          value={value?.toString() ?? ""}
          onChangeText={text => {
            if (text.length === 0) {
              setValue(null);
              return;
            }

            const value = Number(text);
            if (text.length && Number.isNaN(value) ? null : value) {
              setValue(value);
            }
          }}
        />
      </View>
      <TouchableOpacity
        style={{ justifyContent: "center", padding: 15 }}
        disabled={props.readOnly}
        onPress={() => {
          setValue(value ?? 0 + 1);
        }}
      >
        <PlusIcon color={colors.tendrel.text1.color} />
      </TouchableOpacity>
    </View>
  );
}
