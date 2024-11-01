import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Button from "./Button";

export function SaveAndFinishButton() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <Button
      title={t("workScreen.saveAndFinish.t")}
      variant="filled"
      color={colors.tendrel.interactive3.color}
      textColor={colors.tendrel.text2.color}
      onPress={() => {
        router.navigate("/");
      }}
    />
  );
}
