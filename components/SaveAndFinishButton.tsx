import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";
import Button from "./Button";

export function SaveAndFinishButton() {
  const { colors, colorTheme } = useTheme();
  const { t } = useTranslation();
  return (
    <Button
      title={t("workScreen.saveAndFinish.t")}
      variant="filled"
      color={colors.tendrel.button1.gray}
      textColor={colorTheme === "dark" ? colors.tendrel.text2.color : undefined}
    />
  );
}
