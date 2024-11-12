import { useTheme } from "@/hooks/useTheme";
import { useFragment } from "react-relay";
import { View } from "../View";
import {
  ChecklistResultInlineView$fragment,
  type ChecklistResultInlineView$key,
} from "./ChecklistResultInlineView";
import { DisplayName } from "./DisplayName.native";

interface Props {
  parent: string;
  queryRef: ChecklistResultInlineView$key;
}

export function ChecklistSection({ queryRef }: Props) {
  const { colors } = useTheme();

  const data = useFragment(ChecklistResultInlineView$fragment, queryRef);

  return (
    <View
      style={{
        marginVertical: 4,
        marginHorizontal: 6,
        padding: 6,
        borderRadius: 5,
        borderBottomWidth: 4,
        borderBottomColor: colors.tendrel.text2.color,
      }}
    >
      <View
        style={{
          flexDirection: "column",
          gap: 2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <DisplayName
            style={{ fontWeight: "bold", fontSize: 18 }}
            queryRef={data.name}
          />
        </View>
      </View>
    </View>
  );
}
