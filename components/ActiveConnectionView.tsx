import type {
  ChecklistSortOrder,
  ChecklistStatusStates,
} from "@/__generated__/ActiveConnectionViewRefetchQuery.graphql";
import type { ActiveConnectionView_fragment$key } from "@/__generated__/ActiveConnectionView_fragment.graphql";
import { Text } from "@/components/Text";
import { View } from "@/components/View";
import { useTheme } from "@/hooks/useTheme";
import { addTestIdentifiers } from "@/util/add-test-id";
import { debounce } from "@/util/debounce";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useNavigation } from "expo-router";
import { Filter } from "lucide-react-native";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  type ListRenderItem,
  type NativeSyntheticEvent,
  RefreshControl,
  type TextInputChangeEventData,
  TouchableOpacity,
} from "react-native";
import type { ActionSheetRef } from "react-native-actions-sheet";
import ActionSheet from "react-native-actions-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { graphql, usePaginationFragment } from "react-relay";
import { AlternateConnectionView } from "./AlternateConnectionView";
import Separator from "./Separator";
import { ChecklistInlineView } from "./tendrel/ChecklistInlineView.native";

interface Props {
  parent: string;
  queryRef: ActiveConnectionView_fragment$key;

  /**
   * @default []
   */
  initialSortBy?: ChecklistSortOrder[];
  /**
   * @default true
   */
  initialWithActive?: boolean;
  /**
   * @default null
   */
  initialWithName?: string;
  /**
   * @default []
   */
  initialWithStatus?: ChecklistStatusStates[];
}

export function ActiveConnectionView({ parent, queryRef, ...props }: Props) {
  const [sortBy, _setSortBy] = useState(props.initialSortBy ?? []);
  const [withActive, _setWithActive] = useState(
    props.initialWithActive ?? true,
  );
  const [withName, setWithName] = useState(props.initialWithName ?? null);
  const [withStatus, setWithStatus] = useState(props.initialWithStatus ?? []);

  const { data, hasNext, loadNext, refetch } = usePaginationFragment(
    graphql`
      fragment ActiveConnectionView_fragment on Query
      @refetchable(queryName: "ActiveConnectionViewRefetchQuery")
      @argumentDefinitions(
        parent: { type: "ID!" }
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
        sortBy: { type: "[ChecklistSortOrder!]", defaultValue: [] }
        withActive: { type: "Boolean", defaultValue: true }
        withName: { type: "String", defaultValue: null }
        withStatus: { type: "[ChecklistStatusStates!]", defaultValue: [] }
      ) {
        checklists(
          parent: $parent
          first: $count
          after: $cursor
          sortBy: $sortBy
          withActive: $withActive
          withName: $withName
          withStatus: $withStatus
        ) @connection(key: "ActiveConnectionView__checklists") {
          edges {
            node {
              id
              ...ChecklistInlineView
            }
          }
          totalCount
        }
      }
    `,
    queryRef,
  );

  const actionSheetRef = useRef<ActionSheetRef>(null);
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const progress = useSharedValue(0);
  const [currentTab, setCurrentTab] = useState(0);
  const [isPending, startTransition] = useTransition();
  const { colors, colorTheme } = useTheme();
  const { t } = useTranslation();

  const onSearchChanges = useCallback(
    debounce((text?: string) => setWithName(text?.length ? text : null)),
    [],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        onChangeText: (
          event: NativeSyntheticEvent<TextInputChangeEventData>,
        ) => {
          onSearchChanges(event.nativeEvent.text);
        },
        textColor: colors.tendrel.text2.color,
        tintColor: colors.tendrel.button1.color, // I have no idea why these styles wont apply when done from the parent -murphy
      },
    });
  }, [colorTheme]); // Text color wont change when dark mode is toggled unless this is set

  const renderItem: ListRenderItem<(typeof data.checklists.edges)[number]> =
    useCallback(
      ({ item }) => (
        <ChecklistInlineView key={item.node.id} queryRef={item.node} />
      ),
      [],
    );

  const onEndReached = useCallback(
    () => hasNext && loadNext(10),
    [hasNext, loadNext],
  );

  const _filters = [
    t("checklist.all.t"),
    t("checklist.assignedToMe.t"),
    t("checklist.dueToday.t"),
    t("checklist.onDemand.t"),
  ];

  useEffect(() => {
    startTransition(() => {
      refetch(
        {
          sortBy,
          withActive,
          withName,
          withStatus,
        },
        { fetchPolicy: "store-and-network" },
      );
    });
  }, [refetch, sortBy, withActive, withName, withStatus]);

  const flatListStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [1, 0], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(
          progress.value,
          [0, 1],
          [0, -50],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  return (
    <View {...addTestIdentifiers("checklistsPage")} style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View style={[{ flex: 1 }, flatListStyle]}>
          <FlatList
            ListHeaderComponent={
              <>
                <SegmentedControl
                  values={[t("checklist.open.t"), t("checklist.completed.t")]}
                  style={{ marginHorizontal: 10, marginBottom: 5 }}
                  selectedIndex={currentTab}
                  onChange={event => {
                    const tab = event.nativeEvent.selectedSegmentIndex;
                    setCurrentTab(tab);
                    setWithStatus([tab === 0 ? "open" : "closed"]);
                  }}
                />
                {/* <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 3,
                  padding: 3,
                }}
              >
                <TouchableOpacity
                  style={{
                    padding: 4,
                    backgroundColor:
                      colorTheme === "light"
                        ? inverseColors.tendrel.interactive2.color
                        : colors.tendrel.interactive3.color,
                    borderRadius: 10,
                  }}
                  onPress={() => actionSheetRef.current?.show()}
                >
                  <Filter
                    color={
                      colorTheme === "light"
                        ? inverseColors.tendrel.text2.gray
                        : colors.tendrel.text2.color
                    }
                  />
                </TouchableOpacity>
                <Separator orientation="vertical" />
                <FlatList
                  data={filters}
                  horizontal
                  contentContainerStyle={{ gap: 5 }}
                  renderItem={item => (
                    <TouchableOpacity
                      style={{
                        borderColor: colors.tendrel.border2.gray,
                        backgroundColor:
                          item.item === "All"
                            ? colors.tendrel.interactive3.color
                            : undefined,
                        borderWidth: 0.5,
                        padding: 5,
                        borderRadius: 10,
                      }}
                    >
                      <Text style={{ color: colors.tendrel.text2.color }}>
                        {item.item}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item}
                />
              </View> */}
              </>
            }
            ListFooterComponent={
              <Text
                style={{
                  color: colors.tendrel.text1.gray,
                  textAlign: "center",
                }}
              >
                {t("pagination.showing-n-of.t", {
                  n: data.checklists.edges.length,
                  totalCount: data.checklists.totalCount,
                })}
              </Text>
            }
            ref={flatListRef}
            stickyHeaderIndices={[0]}
            contentInsetAdjustmentBehavior="automatic"
            data={data.checklists.edges}
            contentContainerStyle={{
              flexGrow: 1,
              gap: 5,
            }}
            renderItem={renderItem}
            keyExtractor={item => item.node.id}
            refreshControl={
              <RefreshControl
                refreshing={isPending}
                onRefresh={() =>
                  startTransition(() => {
                    refetch(
                      {
                        sortBy,
                        withActive,
                        withName,
                        withStatus,
                      },
                      { fetchPolicy: "network-only" },
                    );
                  })
                }
              />
            }
            onEndReachedThreshold={0.2}
            onEndReached={onEndReached}
          />
        </Animated.View>
      </GestureHandlerRootView>
      <AlternateConnectionView parent={parent} progress={progress} />
      <ActionSheet
        ref={actionSheetRef}
        animated
        elevation={2}
        snapPoints={[150]}
        containerStyle={{
          height: "50%",
          backgroundColor: colors.tendrel.background1.color,
        }}
      />
    </View>
  );
}
