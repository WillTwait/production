import { useTheme } from "@/hooks/useTheme";
import * as WebBrowser from "expo-web-browser";
import { ListOrdered } from "lucide-react-native";
import { PlatformColor, TouchableOpacity } from "react-native";
import { useFragment } from "react-relay";
import { Text } from "../Text";
import { View } from "../View";
import { Sop$fragment, type Sop$key } from "./Sop";

interface Props {
  queryRef: Sop$key;
  i18n?: {
    label?: string;
  };
}

export function Sop({ queryRef, ...props }: Props) {
  const data = useFragment(Sop$fragment, queryRef);

  const { colors } = useTheme();
  const { label = "SOP" } = props.i18n ?? {};

  const _handlePressButtonAsync = async () => {
    await WebBrowser.openBrowserAsync(data.sop);
  };

  return (
    <View
      style={{
        paddingVertical: 2,
        paddingHorizontal: 4,
      }}
    >
      <View style={{ alignItems: "center", flexDirection: "row" }}>
        <ListOrdered size={14} color={colors.tendrel.text1.gray} />
        <Text
          style={{
            paddingHorizontal: 4,
            color: colors.tendrel.text1.gray,
          }}
        >
          {label}
        </Text>
      </View>
      <TouchableOpacity onPress={_handlePressButtonAsync}>
        <Text
          style={{
            textDecorationLine: "underline",
            color: PlatformColor("linkColor"),
          }}
        >
          {data.sop}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
