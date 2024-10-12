import { useTheme } from "@/hooks/useTheme";
import {
  type ButtonProps,
  type DimensionValue,
  Button as ReactNativeButton,
  Text,
  TouchableOpacity,
} from "react-native";

export type TendyButtonProps = ButtonProps & {
  title?: string;
  height?: DimensionValue;
  width?: DimensionValue;
  children?: React.ReactNode;
  textColor?: string;
  icon?: React.ReactNode;
  iconAfter?: React.ReactNode;
  loading?: boolean;
  variant?: "default" | "filter" | "filled";
};

export function Button({
  variant = "default",
  height,
  width,
  children,
  textColor,
  icon,
  iconAfter,
  title,
  ...rest
}: TendyButtonProps) {
  const { colors } = useTheme();

  const buttonColor = rest.color ? rest.color : colors.tendrel.text1.color;
  //FIXME: This should probably be broken out into two components? Like a simple button and then a Pressable implementation. Very limited on the styling options from the parent with Button Props
  if (variant === "filled") {
    return (
      <TouchableOpacity
        style={{
          height,
          width,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 5,
          paddingVertical: 7,
          paddingHorizontal: 12,
          gap: 2,
          backgroundColor: rest.color ? rest.color : colors.tendrel.text1.color,
        }}
        onPress={rest.onPress}
        disabled={rest.disabled}
        {...rest}
      >
        {icon}
        <Text
          style={{
            fontSize: 16,
            color: textColor ? textColor : colors.tendrel.text2.color,
          }}
        >
          {title}
        </Text>
        {children}
        {iconAfter}
      </TouchableOpacity>
    );
  }

  if (variant === "filter") {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 10,
          borderColor:
            variant === "filter" ? colors.tendrel.border2.color : undefined,
          borderWidth: variant === "filter" ? 0.5 : undefined,
          backgroundColor:
            variant === "filter" ? colors.tendrel.interactive1.gray : undefined,
          padding: 5,
        }}
        disabled={rest.disabled}
      >
        {icon}
        <Text
          style={{
            color:
              variant === "filter" ? colors.tendrel.text2.gray : buttonColor,
          }}
        >
          {title}
        </Text>
        {iconAfter}
      </TouchableOpacity>
    );
  }

  return <ReactNativeButton title={title} color={buttonColor} {...rest} />;
}

export default Button;
