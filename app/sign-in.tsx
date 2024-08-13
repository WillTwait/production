import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import "@/extensions/string";
import { addTestIdentifiers } from "@/util/add-test-id";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Image, Keyboard, StyleSheet, TextInput, TouchableWithoutFeedback } from "react-native";

export default function SignIn() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const { t } = useTranslation();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, identifier, password]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={<Image source={require("@/assets/images/adaptive-icon.png")} style={styles.reactLogo} />}
        testId={"signInPage"}
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Sign in</ThemedText>
        </ThemedView>
        <ThemedView>
          <ThemedText type="subtitle">Stage: {process.env.EXPO_PUBLIC_TENDREL_STAGE}</ThemedText>
        </ThemedView>

        <TextInput
          style={styles.input}
          placeholder={`${t("username.t").capitalize()} ${t("or.t")} ${t("email.t")}`}
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
          {...addTestIdentifiers("username")}
          returnKeyType="done"
        />
        <TextInput
          style={styles.input}
          placeholder={t("password.t").capitalize()}
          value={password}
          secureTextEntry={true}
          autoCapitalize="none"
          onChangeText={setPassword}
          {...addTestIdentifiers("password")}
          returnKeyType="done"
        />
        <Button title="Sign In" onPress={onSignInPress} {...addTestIdentifiers("signInButton")} />
      </ParallaxScrollView>
    </TouchableWithoutFeedback>
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
