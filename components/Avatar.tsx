import { Text } from "@/components/Text";
import { View } from "@/components/View";
import { useTheme } from "@/hooks/useTheme";

interface Props {
  fallback: string;
  size?: number;
}

export default function Avatar({ fallback, size = 30 }: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.tendrel.interactive2.color,
      }}
    >
      <Text
        style={{
          color: colors.tendrel.text2.color,
          justifyContent: "center",
          alignItems: "center",
          fontSize: size / 2.5, // FIXME: make this less brittle
        }}
      >
        {fallback}
      </Text>
    </View>
  );
}
