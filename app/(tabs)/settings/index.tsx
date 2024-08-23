import { useAuth } from "@clerk/clerk-expo";
import { Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const { signOut } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Button onPress={() => signOut()} title="Sign Out" />
    </SafeAreaView>
  );
}
