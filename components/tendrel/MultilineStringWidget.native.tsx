import { useDebounce } from "@/hooks/useDebounce";
import { useCallback } from "react";
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
    };

export function MultilineStringWidget(props: Props) {
  const data = useFragment(ReaderFragment, props.readerFragmentRef);
  const environment = useRelayEnvironment();

  if (props.readOnly) {
    return (
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <TextInput value={data.string ?? ""} editable={false} />
      </View>
    );
  }

  const onChange = useCallback(
    (value: string | null) => {
      commitLocalUpdate(environment, store => {
        const { updatableData } = store.readUpdatableFragment(
          WriterFragment,
          props.writerFragmentRef,
        );

        updatableData.string = value?.length ? value : null;
      });
    },
    [environment, props.writerFragmentRef],
  );

  const { value, setValue } = useDebounce(onChange, {
    debounceMs: 200,
    initialValue: data.string ?? null,
  });

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <View style={{ width: "80%" }}>
        <TextInput
          value={value ?? ""}
          onChangeText={value => setValue(value.length ? value : null)}
        />
      </View>
    </View>
  );
}
