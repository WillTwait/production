import { useTheme } from "@/hooks/useTheme";

import {
  TextInput as ReactNativeTextInput,
  StyleSheet,
  type TextInputProps,
  View,
} from "react-native";

export type TendyTextInputProps = TextInputProps & {
  type?: "default";
  icon?: React.ReactNode;
  iconAfter?: React.ReactNode;
};

export function TextInput({
  type = "default",
  icon,
  iconAfter,
  style,
  ...rest
}: TendyTextInputProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        padding: 10,
        // margin: 10,
        borderRadius: 10,
        borderColor: colors.tendrel.border2.gray,
      }}
    >
      {icon}
      <ReactNativeTextInput
        placeholderTextColor={colors.tendrel.text1.gray}
        style={StyleSheet.flatten([
          {
            color: colors.tendrel.text2.color,
            paddingHorizontal: 5,
            flex: 1,
          },
          style,
        ])}
        {...rest}
      />
      {iconAfter}
    </View>
  );
}
