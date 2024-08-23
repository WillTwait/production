import useThemeContext from "@/hooks/useTendyTheme";

import { TextInput, type TextInputProps, View } from "react-native";

export type TendyTextInputProps = TextInputProps & {
  type?: "default";
  icon?: React.ReactNode;
  iconAfter?: React.ReactNode;
};

export function TendyTextInput({
  type = "default",
  icon,
  iconAfter,
  ...rest
}: TendyTextInputProps) {
  const { colors } = useThemeContext();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        padding: 10,
        margin: 10,
        borderRadius: 10,
        borderColor: colors.tendrel.border2.gray,
      }}
    >
      {icon}
      <TextInput
        placeholderTextColor={colors.tendrel.text1.gray}
        style={{
          color: colors.tendrel.text2.color,
          paddingHorizontal: 5,
          flex: 1,
        }}
        {...rest}
      />
      {iconAfter}
    </View>
  );
}
