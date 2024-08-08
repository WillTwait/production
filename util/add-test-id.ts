import { Platform } from "react-native";

export const addTestIdentifiers = (testId?: string, label?: string) => {
  return Platform.OS === "android" ? { accessibilityLabel: label ?? testId, testID: testId } : { testID: testId };
};
