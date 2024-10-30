import type { NumberWidgetInput } from "@/__generated__/ChecklistResultInlineViewSetValueMutation.graphql";
import { useState } from "react";
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
} from "./NumberWidget";

const NV = Symbol();

type Props =
  | {
      readOnly: true;
      readerFragmentRef: ReaderFragmentRef;
    }
  | {
      readOnly?: false;
      readerFragmentRef: ReaderFragmentRef;
      writerFragmentRef: WriterFragmentRef;
      onCommit: (input: { number: NumberWidgetInput }) => void;
    };

export function NumberWidget(props: Props) {
  const data = useFragment(ReaderFragment, props.readerFragmentRef);
  const environment = useRelayEnvironment();
  const [inputValue, setInputValue] = useState(data.number?.toString() ?? "");

  function handleTextChange(text: string) {
    if (props.readOnly) return;
    let commit = null;
    if (text.length === 0) {
      // n/v
      commit = NV;
      setInputValue("");
    } else if (text.length === 1) {
      // we allow anything as the first character, which allows for
      // negation and decimals, but we don't commit it just yet
      setInputValue(text);
    } else if (!Number.isNaN(Number.parseFloat(text))) {
      // retain whatever the user has typed so far, which allows for
      // extending decimals.
      setInputValue(text);
      // we commit the numeric part
      commit = Number.parseFloat(text);
    }

    if (commit) {
      commitLocalUpdate(environment, store => {
        const { updatableData } = store.readUpdatableFragment(
          WriterFragment,
          props.writerFragmentRef,
        );
        if (updatableData.number !== commit) {
          updatableData.number = commit === NV ? null : commit;
        }
      });
      props.onCommit({
        number: { value: commit === NV ? null : commit },
      });
    }
  }

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <View style={{ width: "50%" }}>
        <TextInput
          editable={!props.readOnly}
          keyboardType="number-pad"
          textAlign="center"
          value={inputValue}
          onChangeText={handleTextChange}
        />
      </View>
    </View>
  );
}
