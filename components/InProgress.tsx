import type { InProgressPaginationContainer_fragment$key } from "@/__generated__/InProgressPaginationContainer_fragment.graphql";
import type { InProgressQuery } from "@/__generated__/InProgressQuery.graphql";
import { useTheme } from "@/hooks/useTheme";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { useState, useTransition } from "react";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import Animated, {
  Extrapolation,
  type SharedValue,
  interpolate,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay";
import { Text } from "./Text";
import { View } from "./View";
import { ChecklistInlineView } from "./tendrel/ChecklistInlineView.native";

interface Props {
  parent: string;
  progress: SharedValue<number>;
}

export default function InProgress({ parent, ...props }: Props) {
  const data = useLazyLoadQuery<InProgressQuery>(
    graphql`
      query InProgressQuery($parent: ID!) {
        ...InProgressPaginationContainer_fragment @arguments(parent: $parent)
      }
    `,
    {
      parent: parent,
    },
    { fetchPolicy: "store-and-network" },
  );

  const bottomTabHeight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { height } = Dimensions.get("window");

  const collapsibleStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          props.progress.value,
          [0, 1],
          [
            height,
            // FIXME: @murphy I added the `+ 25` to hackishly fix the
            // "In progress animation underlaps header" bug.
            headerHeight + insets.bottom + insets.top + bottomTabHeight + 25,
          ],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: bottomTabHeight - insets.bottom,
          left: 0,
          right: 0,
          height: height,
          overflow: "hidden",
        },
        collapsibleStyle,
      ]}
    >
      <PaginationContainer queryRef={data} {...props} />
    </Animated.View>
  );
}

interface PaginationProps {
  progress: SharedValue<number>;
  queryRef: InProgressPaginationContainer_fragment$key;
}

function PaginationContainer({ progress, queryRef }: PaginationProps) {
  const { data, loadNext, hasNext, refetch } = usePaginationFragment(
    graphql`
      fragment InProgressPaginationContainer_fragment on Query
      @refetchable(queryName: "InProgressRefetchQuery")
      @argumentDefinitions(
        parent: { type: "ID!" }
        count: { type: "Int", defaultValue: 5 }
        cursor: { type: "String" }
        isOpen: { type: "Boolean", defaultValue: false }
      ) {
        checklists(
          parent: $parent
          first: $count
          after: $cursor
          withStatus: [inProgress]
        ) @connection(key: "InProgress__checklists", filters: []) {
          edges {
            node {
              id
              ...ChecklistInlineView @include(if: $isOpen)
            }
          }
          totalCount
        }
      }
    `,
    queryRef,
  );

  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const toggleCollapsible = () => {
    startTransition(() => {
      progress.value = withTiming(collapsibleOpen ? 0 : 1, { duration: 500 });
      setCollapsibleOpen(prev => !prev);
      refetch({ isOpen: !collapsibleOpen });
    });
  };

  const { colors } = useTheme();

  return (
    <>
      <TouchableOpacity onPress={toggleCollapsible}>
        <View
          style={{
            padding: 10,
            flexDirection: "row",
            borderTopWidth: 0.2,
            borderTopColor: colors.tendrel.border3.gray,
            backgroundColor: colors.tendrel.background1.color,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              columnGap: 6,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              In Progress
            </Text>
            <View
              style={{
                height: 20,
                width: 20,
                borderRadius: 10,
                backgroundColor: colors.feedback.error.interactive2,
                alignItems: "center",

                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  textAlign: "center",
                  color: colors.feedback.error.text1,
                  lineHeight: 14,
                }}
              >
                {data.checklists.totalCount}
              </Text>
            </View>
          </View>
          {collapsibleOpen ? (
            <ChevronDown color={colors.tendrel.text1.color} />
          ) : (
            <ChevronUp color={colors.tendrel.text1.color} />
          )}
        </View>
      </TouchableOpacity>
      <View
        style={{ flex: 1, backgroundColor: colors.tendrel.background1.color }}
      >
        {collapsibleOpen && (
          <FlatList
            contentInsetAdjustmentBehavior="automatic"
            data={data.checklists.edges}
            contentContainerStyle={{
              flexGrow: 1,
              gap: 5,
            }}
            renderItem={({ item }) => (
              <ChecklistInlineView key={item.node.id} queryRef={item.node} />
            )}
            keyExtractor={item => item.node.id}
            onEndReachedThreshold={0.2}
            onEndReached={() => hasNext && loadNext(10)}
            refreshControl={
              <RefreshControl
                refreshing={isPending}
                onRefresh={() =>
                  startTransition(() => {
                    refetch(
                      { isOpen: collapsibleOpen },
                      { fetchPolicy: "network-only" },
                    );
                  })
                }
              />
            }
          />
        )}
      </View>
    </>
  );
}
