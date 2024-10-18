import TendrelIcon from "@/assets/images/Tendrel-Icon.svg";
import Button from "@/components/Button";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Text } from "@/components/Text";
import { TextInput } from "@/components/TextInput";
import { View } from "@/components/View";
import theme from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { addTestIdentifiers } from "@/util/add-test-id";
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
import * as Sentry from "@sentry/react";
import { router } from "expo-router";
import Head from "expo-router/head";
import { Eye, EyeOff, Lock, User } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import { toast } from "sonner-native";

export default function SignIn() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [secureEntry, setSecureEntry] = useState(true);

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    await Sentry.startSpan({ name: "clerk/sign-in" }, async () => {
      try {
        const signInAttempt = await signIn.create({
          identifier,
          password,
        });

        if (signInAttempt.status === "complete") {
          await setActive({ session: signInAttempt.createdSessionId });
          router.replace("/");
        }
      } catch (err) {
        toast.error(parseErrorMessage(err));
      }
    });
  }, [isLoaded, identifier, password, signIn, setActive]);

  function parseErrorMessage(error: unknown) {
    if (isClerkAPIResponseError(error)) {
      return error.errors.map(e => e.message).join(", ");
    }
    return JSON.stringify(error, null, 2);
  }

  return (
    <>
      <Head>
        <meta
          name="theme-color"
          content={colors.tendrel.interactive1.color}
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content={colors.tendrel.interactive1.color}
          media="(prefers-color-scheme: dark)"
        />
      </Head>
      <View
        style={{ flex: 1, backgroundColor: colors.tendrel.background1.color }}
      >
        <ParallaxScrollView
          headerBackgroundColor={colors.tendrel.interactive1.color}
          headerImage={<TendrelIcon fill={colors.tendrel.text2.color} />}
          testId={"signInPage"}
        >
          <View>
            <Text type="title">Sign in</Text>
          </View>
          <TextInput
            keyboardType="email-address"
            placeholder={`${t("signIn.username.t")} ${t("signIn.or.t")} ${t(
              "signIn.email.t",
            )}`}
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            {...addTestIdentifiers("username")}
            returnKeyType="done"
            icon={
              <User size={theme.icon.size} color={colors.tendrel.text1.color} />
            }
          />
          <TextInput
            placeholder={t("signIn.password.t")}
            value={password}
            secureTextEntry={secureEntry}
            autoCapitalize="none"
            onChangeText={setPassword}
            {...addTestIdentifiers("password")}
            returnKeyType="done"
            icon={
              <Lock size={theme.icon.size} color={colors.tendrel.text1.color} />
            }
            iconAfter={
              <TouchableOpacity onPress={() => setSecureEntry(!secureEntry)}>
                {secureEntry ? (
                  <Eye
                    size={theme.icon.size}
                    color={colors.tendrel.text1.color}
                  />
                ) : (
                  <EyeOff
                    size={theme.icon.size}
                    color={colors.tendrel.text1.color}
                  />
                )}
              </TouchableOpacity>
            }
          />
          <Button
            title="Sign in"
            onPress={onSignInPress}
            {...addTestIdentifiers("signInButton")}
          />
          {process.env.EXPO_PUBLIC_TENDREL_STAGE !== "beta" ? (
            <Text type="subtitle" style={{ alignSelf: "center" }}>
              Stage: {process.env.EXPO_PUBLIC_TENDREL_STAGE}
            </Text>
          ) : undefined}
        </ParallaxScrollView>
      </View>
    </>
  );
}
