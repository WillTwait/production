import { Text } from "@/components/Text";
import { View } from "@/components/View";
import useThemeContext from "@/hooks/useTendyTheme";

interface Props {
  firstName: string;
  lastName?: string;
  size?: number;
}

export default function Avatar({ firstName, lastName, size = 30 }: Props) {
  const { colors, inverseColors } = useThemeContext();
  const firstInitial =
    firstName.length >= 1 ? firstName.charAt(0).toUpperCase() : "";

  const lastInitial =
    lastName && lastName.length >= 1 ? lastName.charAt(0).toUpperCase() : "";

  // Combine the initials
  const initials = `${firstInitial}${lastInitial}`;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.tendrel.button1.color,
      }}
    >
      <Text
        style={{
          color: inverseColors.tendrel.text2.color,
          justifyContent: "center",
          alignItems: "center",
          fontSize: size / 2,
        }}
      >
        {initials}
      </Text>
    </View>
  );
}
