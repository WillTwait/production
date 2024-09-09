import type { ResultType } from "@/app/(tabs)/(home)/work";
import { TextInput } from "@/components/TextInput";
import useThemeContext from "@/hooks/useTendyTheme";
import { Minus, Plus } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

interface Props {
  result: ResultType;
  started: boolean;
  updateResult(
    value: string | number | null | boolean,
    result: ResultType,
  ): void;
}

export default function CounterWidget({
  result,
  started,
  updateResult,
}: Props) {
  const { colors } = useThemeContext();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <TouchableOpacity
        style={{ justifyContent: "center" }}
        onPress={() => updateResult((result.value as number) - 1, result)}
        disabled={!started}
      >
        <Minus color={colors.tendrel.text1.color} />
      </TouchableOpacity>
      <View style={{ width: "20%" }}>
        <TextInput
          value={(result.value as number | null)?.toString() ?? ""}
          onChangeText={text => updateResult(text, result)}
          keyboardType="numeric"
          textAlign="center"
          editable={started}
        />
      </View>
      <TouchableOpacity
        style={{ justifyContent: "center" }}
        onPress={() => updateResult((result.value as number) + 1, result)}
        disabled={!started}
      >
        <Plus color={colors.tendrel.text1.color} />
      </TouchableOpacity>
    </View>
  );
}
