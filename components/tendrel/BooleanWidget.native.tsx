import type { BooleanWidgetInput } from "@/__generated__/ChecklistResultInlineViewSetValueMutation.graphql";
import { Switch } from "react-native";
import { useFragment, useRelayEnvironment } from "react-relay";
import { commitLocalUpdate } from "relay-runtime";
import { View } from "../View";
import {
  ReaderFragment,
  type ReaderFragmentRef,
  WriterFragment,
  type WriterFragmentRef,
} from "./BooleanWidget";

type Props =
  | {
      readOnly: true;
      readerFragmentRef: ReaderFragmentRef;
    }
  | {
      readOnly?: false;
      readerFragmentRef: ReaderFragmentRef;
      writerFragmentRef: WriterFragmentRef;
      onCommit: (input: { boolean: BooleanWidgetInput }) => void;
    };

export function BooleanWidget(props: Props) {
  const data = useFragment(ReaderFragment, props.readerFragmentRef);
  const environment = useRelayEnvironment();

  if (props.readOnly) {
    return (
      <View style={{ alignItems: "center" }}>
        <Switch value={data.checked ?? false} disabled />
      </View>
    );
  }

  return (
    <View style={{ alignItems: "center" }}>
      <Switch
        value={data.checked ?? false}
        onValueChange={value => {
          commitLocalUpdate(environment, store => {
            const { updatableData } = store.readUpdatableFragment(
              WriterFragment,
              props.writerFragmentRef,
            );
            updatableData.checked = value;
          });
          props.onCommit({ boolean: { value } });
        }}
      />
    </View>
  );
}
