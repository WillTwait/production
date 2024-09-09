import type { ResultType } from "@/app/(tabs)/(home)/work";
import { TextInput } from "@/components/TextInput";

interface Props {
  result: ResultType;
  started: boolean;
  updateResult(
    value: string | number | null | boolean,
    result: ResultType,
  ): void;
}

export default function StringWidget({ result, started, updateResult }: Props) {
  return (
    <TextInput
      value={(result.value as string | null) ?? ""}
      onChangeText={text => updateResult(text, result)}
      editable={started}
    />
  );
}
