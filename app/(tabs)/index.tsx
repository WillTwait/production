import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useMigrationHelper } from "@/db/drizzle";
import type { TabsIndexQuery } from "@/g/TabsIndexQuery.graphql";
import { addTestIdentifiers } from "@/util/add-test-id";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Button, Image, StyleSheet, View } from "react-native";
import { graphql, useLazyLoadQuery } from "react-relay";

export default function HomeScreen() {
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
  const { signOut } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();

  const data = useLazyLoadQuery<TabsIndexQuery>(
    graphql`
      query TabsIndexQuery {
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

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      testId={"customerSelectPage"}
      headerImage={
        <Image
          source={require("@/assets/images/adaptive-icon.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome {user.fullName}</ThemedText>
      </ThemedView>

      {data.user.organizations.edges.map(({ node }) => (
        <ThemedText key={node.id}>{node.name.value}</ThemedText>
      ))}

      <Button
        title={"Sign out"}
        {...addTestIdentifiers("signOutButton")}
        onPress={() => signOut()}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 490,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
