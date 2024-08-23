import { ThemedText } from "@/components/ThemedText";

import { useMigrationHelper } from "@/db/drizzle";
import getBottomPadding from "@/hooks/getBottomPadding";

import type { HomeIndexQuery } from "@/g/HomeIndexQuery.graphql";

import { useState } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";

import { useUser } from "@clerk/clerk-expo";

import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  FlatList,
  type NativeSyntheticEvent,
  Text,
  type TextInputChangeEventData,
  View,
} from "react-native";

export default function Home() {
  const { success, error } = useMigrationHelper();

  if (error) {
    return (
      <View>
        <ThemedText>Migration error: {error.message}</ThemedText>
      </View>
    );
  }
  if (!success) {
    return (
      <View>
        <ThemedText>Migration is in progress...</ThemedText>
      </View>
    );
  }

  return <Content />;
}

function Content() {
  // const { tendrel } = useTendrel();

  const [_loading, _setLoading] = useState(true);
  const bottomHeight = getBottomPadding();
  const navigation = useNavigation();

  // biome-ignore lint/correctness/useExhaustiveDependencies: todo
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        onChangeText: (event: NativeSyntheticEvent<TextInputChangeEventData>) =>
          console.log(event.nativeEvent.text),
      },
    });
  }, []);

  const { isLoaded, isSignedIn } = useUser();

  const _data = useLazyLoadQuery<HomeIndexQuery>(
    graphql`
      query HomeIndexQuery {
        user {
          organizations {
            edges {
              node {
                id
                name {
                  value
                }
              }
            }
          }
        }
      }
    `,
    {},
  );

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  // if (loading) {
  //   return <ThemedText>Loading!</ThemedText>;
  // }
  //
  const dummyArray = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    name: `Person ${index + 1}`,
    age: Math.floor(Math.random() * 50) + 18, // Random age between 18 and 67
    job: `Job ${index + 1}`,
  }));

  // {data.user.organizations.edges.map(({ node }) => (
  //   <ThemedText key={node.id}>{node.name.value}</ThemedText>
  // ))}

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      data={dummyArray}
      style={{ flex: 1 }}
      contentContainerStyle={{
        flexGrow: 1,
        gap: 10,
        // paddingVertical: 16,

        paddingBottom: bottomHeight,
      }}
      renderItem={({ item }) => (
        <View style={{ backgroundColor: "red" }}>
          <Text>{item.id}</Text>
          <Text>{item.name}</Text>
          <Text>{item.job}</Text>
        </View>
      )}
      keyExtractor={item => item.id.toString()}
    />
  );
}
