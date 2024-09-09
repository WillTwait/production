import Button from "@/components/Button";
import Seperator from "@/components/Separator";
import { Text } from "@/components/Text";
import { View } from "@/components/View";
import useThemeContext from "@/hooks/useTendyTheme";
import {
  CheckCircle,
  Circle,
  Info,
  ListOrdered,
  Play,
  TimerIcon,
} from "lucide-react-native";
import { useRef, useState } from "react";
import { FlatList, SafeAreaView } from "react-native";

import Timer from "@/components/Timer";
import BooleanWidget from "@/components/tendrel/results/boolean";
import CounterWidget from "@/components/tendrel/results/counter";
import StringWidget from "@/components/tendrel/results/string";
import ReadMore from "@fawazahmed/react-native-read-more";
import { ProgressView } from "@react-native-community/progress-view";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
import ActionSheet, { type ActionSheetRef } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Checklist = {
  id: number;
  active: boolean;
  // attachments(
  //   first: Int
  //   last: Int
  //   before: String
  //   after: String
  // ): AttachmentConnection!
  auditable: boolean;
  description: string;
  // items(
  //   first: Int
  //   last: Int
  //   before: String
  //   after: String
  // ): ChecklistItemConnection!
  name: string;
  required: boolean;
  schedule: Date;
  sop: string;
  status: "In Progress" | "Open" | "Closed";
  // # experimental - subject to change
  // children(
  //   first: Int
  //   last: Int
  //   before: String
  //   after: String
  //   search: ChecklistSearchOptions
  // ): ChecklistConnection!
  metadata: string;
};

const fakeChecklist: Checklist[] = [
  {
    id: 1,
    active: false,
    auditable: true,
    description:
      "This checklist is for testing purposes. Usage for external purposes is strictly prohibited. Tendrel is a company that is doing stuff. Some stuff is good, other stuff is gooder.",
    name: "Murph's Checklist",
    required: false,
    schedule: new Date("2025-09-05T18:29:26.471Z"),
    sop: "https://tendrel.io",
    status: "Closed",
    metadata: '{"name": "Joseph Davis", "residency": "400 Freedom St."}',
  },
  {
    id: 2,
    active: true,
    auditable: false,
    description: "Save six happy hundred administration.",
    name: "day",
    required: false,
    schedule: new Date("2025-08-30T18:29:26.477Z"),
    sop: "he",
    status: "Open",
    metadata: '{"name": "Melissa Salazar", "residency": "702 Greenway Blvd."}',
  },
  {
    id: 3,
    active: true,
    auditable: true,
    description: "Decade drop culture loss school maybe.",
    name: "heavy",
    required: true,
    schedule: new Date("2024-08-24T18:29:26.482Z"),
    sop: "behavior",
    status: "Closed",
    metadata: '{"name": "Robert Davenport", "residency": "5271 Orchard Ave."}',
  },
  {
    id: 4,
    active: true,
    auditable: false,
    description: "Much agent hard growth.",
    name: "off",
    required: false,
    schedule: new Date("2024-06-06T18:29:26.487Z"),
    sop: "environment",
    status: "Open",
    metadata: '{"name": "Angelica Edwards", "residency": "0432 Rainbow Rd."}',
  },
  {
    id: 5,
    active: false,
    auditable: false,
    description: "Field kid song outside involve.",
    name: "ground",
    required: true,
    schedule: new Date("2024-08-25T18:29:26.491Z"),
    sop: "during",
    status: "Closed",
    metadata: '{"name": "Ashley Castaneda", "residency": "3842 Liberty St."}',
  },
  // ... (25 more entries here)
];

export type ResultType = {
  id: number;
  name: string;
  value: string | number | null | boolean;
  required: boolean;
  type: "string input" | "boolean" | "counter";
};

const resultsStatic: ResultType[] = [
  {
    id: 1,
    name: "Item on floor",
    value: null,
    required: false,
    type: "counter",
  },
  {
    id: 2,
    name: "Food is safe",
    value: false,
    required: true,
    type: "boolean",
  },
  { id: 3, name: "Color", value: null, required: true, type: "string input" },
  {
    id: 4,
    name: "Other question???",
    value: false,
    required: true,
    type: "boolean",
  },
  { id: 5, name: "Notes", value: false, required: true, type: "string input" },
];

export default function Work() {
  const { colors, colorTheme } = useThemeContext();
  const checklist = fakeChecklist[0];
  const [results, setResults] = useState(resultsStatic);
  const [started, setStarted] = useState(false);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  function updateResult(
    value: string | number | null | boolean,
    result: ResultType,
  ) {
    setResults(
      results.map(res => {
        if (res.id === result.id) {
          return { ...res, value: value };
        }
        return res;
      }),
    );
  }

  function renderWidget(result: ResultType) {
    switch (result.type) {
      case "boolean": {
        return (
          <BooleanWidget
            result={result}
            started={started}
            updateResult={(value, result) => updateResult(value, result)}
          />
        );
      }
      case "counter": {
        return (
          <CounterWidget
            result={result}
            started={started}
            updateResult={(value, result) => updateResult(value, result)}
          />
        );
      }
      case "string input": {
        return (
          <StringWidget
            result={result}
            started={started}
            updateResult={(value, result) => updateResult(value, result)}
          />
        );
      }
    }
  }

  function getProgress() {
    return results.filter(r => r.value !== null).length;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, height: "100%" }}>
        <ActionSheet
          containerStyle={{
            height: "50%",
            padding: 20,
            backgroundColor: colors.tendrel.background1.color,
          }}
          ref={actionSheetRef}
          safeAreaInsets={insets}
        >
          <View style={{ gap: 20 }}>
            <View style={{ alignItems: "center" }}>
              <ProgressView
                progressTintColor={colors.tendrel.button2.color}
                trackTintColor={colors.tendrel.interactive3.color}
                style={{ width: "100%" }}
                progress={getProgress() / results.length}
              />
              <Text>
                {t("workScreen.numberOfCompleted.t", {
                  dividend: getProgress(),
                  divisor: results.length,
                }).capitalize()}
              </Text>
            </View>
            <Button
              title={t("workScreen.saveAndFinish.t").capitalize()}
              variant="filled"
              color={colors.tendrel.button1.gray}
              textColor={
                colorTheme === "dark" ? colors.tendrel.text2.color : undefined
              }
            />
            <Button
              title={t("workScreen.cancelAndDiscard.t").capitalize()}
              variant="filled"
              color={colors.tendrel.button1.gray}
              textColor={
                colorTheme === "dark" ? colors.tendrel.text2.color : undefined
              }
            />
            <Button
              title={t("workScreen.submit.t").capitalize()}
              variant="filled"
              color={colors.tendrel.button1.color}
              textColor={
                colorTheme === "dark" ? colors.tendrel.text2.color : undefined
              }
            />
          </View>
        </ActionSheet>
        <View style={{ backgroundColor: colors.tendrel.background2.gray }}>
          <View style={{ flexDirection: "row", padding: 10 }}>
            <Text type="title" style={{ flex: 1 }}>
              {checklist.name}
            </Text>
            <Button
              disabled
              variant="filled"
              icon={
                started ? (
                  <TimerIcon size={16} color={colors.tendrel.text1.color} />
                ) : undefined
              }
              title={!started ? t("workScreen.notStarted.t").capitalize() : ""}
              textColor={colors.tendrel.text2.color}
              color={colors.tendrel.interactive3.color}
            >
              {started ? <Timer startTime={DateTime.now()} /> : undefined}
            </Button>
          </View>
          <Seperator />
          <View
            style={{
              paddingVertical: 2,
              paddingHorizontal: 4,
              marginBottom: 2,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Info size={14} color={colors.tendrel.text1.gray} />
              <Text
                style={{
                  paddingHorizontal: 4,
                  color: colors.tendrel.text1.gray,
                }}
              >
                {t("workScreen.description.t").capitalize()}
              </Text>
            </View>
            <ReadMore
              numberOfLines={2}
              seeMoreText={t("workScreen.seeMore.t").capitalize()}
              seeLessText={t("workScreen.seeLess.t").capitalize()}
              seeMoreStyle={{ color: colors.tendrel.button1.color }}
              seeLessStyle={{ color: colors.tendrel.button1.color }}
              animate={false}
              style={{ color: colors.tendrel.text2.color }}
            >
              {checklist.description}
            </ReadMore>
          </View>
          <Seperator />
          <View
            style={{
              paddingVertical: 2,
              paddingHorizontal: 4,
            }}
          >
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <ListOrdered size={14} color={colors.tendrel.text1.gray} />
              <Text
                style={{
                  paddingHorizontal: 4,
                  color: colors.tendrel.text1.gray,
                }}
              >
                SOP
              </Text>
            </View>
            <Text>{checklist.sop}</Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <FlatList
              data={results}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <View
                  style={{
                    marginVertical: 4,
                    marginHorizontal: 6,
                    backgroundColor: colors.tendrel.background1.color,
                    padding: 10,
                    borderLeftColor:
                      item.value !== null
                        ? colors.feedback.success.button2
                        : item.required
                          ? colors.feedback.error.button2
                          : "gray",
                    borderLeftWidth: started ? 5 : undefined,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ flex: 1 }}>{item.name}</Text>
                    {started ? (
                      item.value !== null ? (
                        <CheckCircle color={colors.feedback.success.button2} />
                      ) : (
                        <Circle color={colors.tendrel.border2.gray} />
                      )
                    ) : undefined}
                  </View>
                  {renderWidget(item)}
                </View>
              )}
            />
            <View style={{ flex: 0, padding: 5 }}>
              {started ? (
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <ProgressView
                      progressTintColor={colors.tendrel.button2.color}
                      trackTintColor={colors.tendrel.interactive3.color}
                      style={{ width: "100%" }}
                      progress={getProgress() / results.length}
                    />
                    <Text>
                      {t("workScreen.numberOfCompleted.t", {
                        dividend: getProgress(),
                        divisor: results.length,
                      }).capitalize()}
                    </Text>
                  </View>
                  <Button
                    title={t("workScreen.finish.t").capitalize()}
                    onPress={() => actionSheetRef.current?.show()}
                    variant="filled"
                    color={colors.tendrel.button1.color}
                  />
                </View>
              ) : (
                <View style={{ alignItems: "center" }}>
                  <Button
                    title={t("workScreen.start.t").capitalize()}
                    variant="filled"
                    onPress={() => setStarted(true)}
                    iconAfter={
                      <Play
                        size={16}
                        color={colors.tendrel.background2.color}
                      />
                    }
                    color={colors.tendrel.button1.color}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
