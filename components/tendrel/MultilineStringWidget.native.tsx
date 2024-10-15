import type { MultilineStringWidgetInput } from "@/__generated__/ChecklistResultInlineViewSetValueMutation.graphql";
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
} from "./MultilineStringWidget";

type Props =
  | {
      readOnly: true;
      readerFragmentRef: ReaderFragmentRef;
    }
  | {
      className?: string;
      readOnly?: false;
      readerFragmentRef: ReaderFragmentRef;
      writerFragmentRef: WriterFragmentRef;
      onCommit: (input: { string: MultilineStringWidgetInput }) => void;
    };

export function MultilineStringWidget(props: Props) {
  const data = useFragment(ReaderFragment, props.readerFragmentRef);
  const environment = useRelayEnvironment();

  if (props.readOnly) {
    return (
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text>{data.string ?? "(no value)"}</Text>
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
      <View style={{ width: "80%" }}>
        <TextInput
          value={data.string ?? ""}
          onChangeText={text => {
            const value = text.length ? text : null;
            commitLocalUpdate(environment, store => {
              const { updatableData } = store.readUpdatableFragment(
                WriterFragment,
                props.writerFragmentRef,
              );
              updatableData.string = value;
            });
            props.onCommit({ string: { value } });
          }}
        />
      </View>
    </View>
  );
}