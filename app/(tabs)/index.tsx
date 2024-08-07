import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useMigrationHelper } from "@/db/drizzle";
import { useTendrel } from "@/tendrel/provider";
import { useAuth } from "@clerk/clerk-expo";
import { run } from "@tendrel/lib";
import { GetUserResponse } from "@tendrel/sdk";
import { useEffect, useState } from "react";
import { Button, Image, StyleSheet, View } from "react-native";

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
  const { signOut, isLoaded, isSignedIn, getToken } = useAuth();
  const { tendrel } = useTendrel();
  const [user, setUser] = useState<GetUserResponse["user"]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn && tendrel) {
      run(async () => {
        const clerkToken = await getToken();
        if (clerkToken) {
          const { token } = await tendrel.getAuthToken({
            strategy: "sessionToken",
            sessionToken: clerkToken,
          });

          const { user } = await tendrel.getUser({
            token: token,
          });

          setUser(user);
          setLoading(false);
        }
      });
    }
  }, [isSignedIn, isLoaded]);

  if (loading) {
    return <ThemedText>Loading!</ThemedText>;
  }
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={<Image source={require("@/assets/images/adaptive-icon.png")} style={styles.reactLogo} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome {user?.name}</ThemedText>
      </ThemedView>

      {user?.workerInstances?.map(wi => {
        return <ThemedText>{wi.customer.name}</ThemedText>;
      })}

      <Button title={"Sign out"} onPress={() => signOut()} />
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