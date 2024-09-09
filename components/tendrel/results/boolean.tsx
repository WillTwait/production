import type { ResultType } from "@/app/(tabs)/(home)/work";
import { Switch, View } from "react-native";

interface Props {
  result: ResultType;
  started: boolean;
  updateResult(
    value: string | number | null | boolean,
    result: ResultType,
  ): void;
}

export default function BooleanWidget({
  result,
  started,
  updateResult,
}: Props) {
  return (
    <View style={{ alignItems: "center" }}>
      <Switch
        value={result.value as boolean}
        onValueChange={newBool => updateResult(newBool, result)}
        disabled={!started}
      />
    </View>
  );
}
