import useThemeContext from "@/hooks/useTendyTheme";
import { Button, type ButtonProps } from "react-native";

export type TendyButtonProps = ButtonProps & {
  title: string;
  variant?: "default";
};

export default function TendyButton({
  variant = "default",
  title,
  ...rest
}: TendyButtonProps) {
  const { colors } = useThemeContext();

  return <Button title={title} color={colors.tendrel.text1.color} {...rest} />;
}
