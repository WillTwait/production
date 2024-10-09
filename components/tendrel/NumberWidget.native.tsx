import { useState } from "react";
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
      onCommit: (value: number | null) => void;
    };

export function NumberWidget(props: Props) {
  const data = useFragment(ReaderFragment, props.readerFragmentRef);
  const environment = useRelayEnvironment();
  const [value, setValue] = useState(data.number?.toString() ?? "");

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
      <View style={{ width: "50%" }}>
        <TextInput
          keyboardType="number-pad"
          textAlign="center"
          value={value}
          onChangeText={text => {
            // FIXME: when switch to micro mutations, we should debounce this callback.
            let commit = null;
            if (text.length === 0) {
              // n/v
              setValue("");
              commit = NV;
            } else if (text.length === 1) {
              // we allow anything as the first character, which allows for
              // negation and decimals, but we don't commit it just yet
              setValue(text);
            } else if (!Number.isNaN(Number(text))) {
              // retain whatever the user has typed so far, which allows for
              // extending decimals.
              setValue(text);
              // we commit the numeric part
              commit = Number(text);
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
              props.onCommit(commit === NV ? null : commit);
            }
          }}
        />
      </View>
    </View>
  );
}
