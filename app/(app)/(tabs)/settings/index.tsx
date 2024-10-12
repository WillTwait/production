import { useTheme } from "@/hooks/useTheme";
import { addTestIdentifiers } from "@/util/add-test-id";
import { useAuth } from "@clerk/clerk-expo";
import { ChevronRight, LogOut, Moon, Sun } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Settings() {
  const { signOut } = useAuth();
  const { colors, setColorTheme, colorTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: colors.tendrel.background1.color,
          gap: 10,
        }}
      >
        <View
          style={{
            borderRadius: 10,
            borderWidth: 0.5,
            borderColor: colors.tendrel.border2.gray,
            backgroundColor: colors.tendrel.background2.color,
            margin: 5,
            padding: 5,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              width: "100%",
              flexDirection: "row",
              gap: 10,
            }}
            onPress={() =>
              setColorTheme(colorTheme === "dark" ? "light" : "dark")
            }
          >
            <View style={{ padding: 5 }}>
              {colorTheme === "dark" ? (
                <Moon color={colors.tendrel.text1.color} />
              ) : (
                <Sun color={colors.tendrel.text1.color} />
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                borderBottomColor: colors.tendrel.border2.color,
                borderBottomWidth: 0.5,
                padding: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: colors.tendrel.text2.color,
                  flex: 1,
                }}
              >
                {t("settingsPage.darkMode.t")}
              </Text>
              <Switch
                value={colorTheme === "dark"}
                onValueChange={value => setColorTheme(value ? "dark" : "light")}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            {...addTestIdentifiers("settingsSignOutButton")}
            onPress={() => signOut()}
            style={{
              flex: 1,
              width: "100%",
              flexDirection: "row",
              gap: 10,
            }}
          >
            <View style={{ padding: 5 }}>
              <LogOut color={colors.tendrel.text1.color} />
            </View>
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                padding: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: colors.tendrel.text2.color,
                  flex: 1,
                }}
              >
                {t("settingsPage.signOut.t")}
              </Text>
              <ChevronRight color={colors.tendrel.text1.color} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
