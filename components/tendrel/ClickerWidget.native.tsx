import { useTheme } from "@/hooks/useTheme";
import { MinusIcon, PlusIcon } from "lucide-react-native";
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

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <TouchableOpacity
        disabled={props.readOnly}
        style={{ justifyContent: "center" }}
        onPress={() => {
          commitLocalUpdate(environment, store => {
            const { updatableData } = store.readUpdatableFragment(
              WriterFragment,
              props.writerFragmentRef,
            );
            updatableData.number = (updatableData.number ?? 0) - 1;
          });
        }}
      >
        <MinusIcon color={colors.tendrel.text1.color} />
      </TouchableOpacity>
      <View style={{ width: "20%" }}>
        <TextInput
          keyboardType="numeric"
          textAlign="center"
          value={data.number?.toString() ?? ""}
          onChangeText={text => {
            const value = Number(text);
            commitLocalUpdate(environment, store => {
              const { updatableData } = store.readUpdatableFragment(
                WriterFragment,
                props.writerFragmentRef,
              );

              updatableData.number =
                text.length && Number.isNaN(value) ? null : value;
            });
            props.onCommit(Number.isNaN(value) ? null : value);
          }}
        />
      </View>
      <TouchableOpacity
        style={{ justifyContent: "center" }}
        disabled={props.readOnly}
        onPress={() => {
          commitLocalUpdate(environment, store => {
            const { updatableData } = store.readUpdatableFragment(
              WriterFragment,
              props.writerFragmentRef,
            );
            updatableData.number = (updatableData.number ?? 0) + 1;
          });
        }}
      >
        <PlusIcon color={colors.tendrel.text1.color} />
      </TouchableOpacity>
    </View>
  );
}
