import useThemeContext from "@/hooks/useTendyTheme";
import {
  type ButtonProps,
  Button as ReactNativeButton,
  Text,
  TouchableOpacity,
} from "react-native";

export type TendyButtonProps = ButtonProps & {
  title: string;
  icon?: React.ReactNode;
  iconAfter?: React.ReactNode;
  loading?: boolean;
  variant?: "default" | "filter";
};

export default function Button({
  variant = "default",
  icon,
  iconAfter,
  title,
  ...rest
}: TendyButtonProps) {
  const { colors } = useThemeContext();

  const buttonColor = rest.color ? rest.color : colors.tendrel.text1.color;

  return (
    <>
      {icon || iconAfter || variant === "filter" ? (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 10,
            borderColor:
              variant === "filter" ? colors.tendrel.border2.color : undefined,
            borderWidth: variant === "filter" ? 0.5 : undefined,
            backgroundColor:
              variant === "filter"
                ? colors.tendrel.interactive1.gray
                : undefined,
            padding: 5,
          }}
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
      ) : (
        <ReactNativeButton title={title} color={buttonColor} {...rest} />
      )}
    </>
  );
}
