import { Text } from "@/components/Text";
import { useMigrationHelper } from "@/db/drizzle";

import type { HomeIndexQuery } from "@/__generated__/HomeIndexQuery.graphql";
import ActionSheet, { type ActionSheetRef } from "react-native-actions-sheet";

import { useRef, useState } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";

import { useUser } from "@clerk/clerk-expo";

import Separator from "@/components/Separator";
import { View } from "@/components/View";
import { ChecklistInlineView } from "@/components/tendrel/ChecklistInlineView.native";
import useThemeContext from "@/hooks/useTendyTheme";
import { useNavigation } from "@react-navigation/native";
import { Edit, Filter } from "lucide-react-native";
import React from "react";
import {
  FlatList,
  type NativeSyntheticEvent,
  type TextInputChangeEventData,
  TouchableOpacity,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";

export default function Home() {
  const { success, error } = useMigrationHelper();

  //FIXME: murphy - move the migration up to the root & use splash screen component? ie dont hide splash screen until migrated
  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }
  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  return <Content />;
}

function Content() {
  // const { tendrel } = useTendrel();

  const [_loading, _setLoading] = useState(true);
  const { colors, inverseColors, colorTheme } = useThemeContext();
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const navigation = useNavigation();

  // biome-ignore lint/correctness/useExhaustiveDependencies: todo
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        onChangeText: (event: NativeSyntheticEvent<TextInputChangeEventData>) =>
          console.log(event.nativeEvent.text),
        textColor: colors.tendrel.text2.color,
        tintColor: colors.tendrel.text1.color, //I have no idea why these styles wont apply when done from the parent -murphy
      },
    });
  }, []);

  const { isLoaded, isSignedIn } = useUser();

  const data = useLazyLoadQuery<HomeIndexQuery>(
    graphql`
      query HomeIndexQuery {
        checklists {
          totalCount
          edges {
            node {
              ... on Checklist {
                id
                ...ChecklistInlineView
              }
            }
          }
        }
      }
    `,
    {},
    {
      fetchPolicy: "store-and-network",
    },
  );

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  // if (loading) {
  //   return <ThemedText>Loading!</ThemedText>;
  // }
  //

  function RightAction() {
    return (
      <TouchableOpacity
        style={{
          paddingHorizontal: 20,
          backgroundColor: colors.tendrel.interactive2.color,
          justifyContent: "center",
        }}
      >
        <Edit color={colors.tendrel.text1.color} />
      </TouchableOpacity>
    );
  }

  const filters = ["All", "Assigned to me", "Due today", "On demand"];

  return (
    <View style={{ flex: 1 }}>
      <ActionSheet
        ref={actionSheetRef}
        animated
        elevation={2}
        snapPoints={[150]}
        containerStyle={{
          height: "50%",
          backgroundColor: colors.tendrel.background1.color,
        }}
      >
        <Text>Hi rugg</Text>
      </ActionSheet>
      <FlatList
        ListHeaderComponent={
          <View
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
          </View>
        }
        contentInsetAdjustmentBehavior="automatic"
        data={data.checklists.edges}
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          gap: 5,
        }}
        renderItem={({ item }) => (
          <Swipeable
            friction={2}
            enableTrackpadTwoFingerGesture
            overshootRight
            useNativeAnimations
            renderRightActions={RightAction}
          >
            <ChecklistInlineView key={item.node.id} queryRef={item.node} />
          </Swipeable>
        )}
        keyExtractor={item => item.node.id}
      />
    </View>
  );
}
