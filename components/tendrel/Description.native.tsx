import { Text } from "@/components/Text";
import { View } from "@/components/View";
import { useTheme } from "@/hooks/useTheme";
import { Info } from "lucide-react-native";
import { useFragment } from "react-relay";
import { Truncate } from "../TruncatedText";
import { Description$fragment, type Description$key } from "./Description";

interface Props {
  queryRef: Description$key;
  i18n?: {
    label?: string;
    seeMore?: string;
    seeLess?: string;
  };
}

export function Description({ queryRef, ...props }: Props) {
  const data = useFragment(Description$fragment, queryRef);

  const { colors } = useTheme();
  const { label = "Description", ...i18n } = props.i18n ?? {};

  return (
    <View
      style={{
        paddingVertical: 2,
        paddingHorizontal: 4,
        marginBottom: 2,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Info size={14} color={colors.tendrel.text1.gray} />
        <Text
          style={{
            paddingHorizontal: 4,
            color: colors.tendrel.text1.gray,
          }}
        >
          {label}
        </Text>
      </View>
      <Truncate
        seeMoreText={i18n.seeMore}
        seeLessText={i18n.seeLess}
        value={data.description.value}
      />
    </View>
  );
}
