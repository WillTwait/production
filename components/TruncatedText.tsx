import { useTheme } from "@/hooks/useTheme";
import ReadMore, {
  type ReadMoreProps,
} from "@fawazahmed/react-native-read-more";

interface Props extends ReadMoreProps {
  value: string;
}

export function Truncate(props: Props) {
  const { colors } = useTheme();
  return (
    <ReadMore
      numberOfLines={2}
      seeMoreText="See more"
      seeLessText="See less"
      seeMoreStyle={{ color: colors.tendrel.button1.color }}
      seeLessStyle={{ color: colors.tendrel.button1.color }}
      animate={false}
      style={{ color: colors.tendrel.text2.color }}
      {...props}
    >
      {props.value}
    </ReadMore>
  );
}
