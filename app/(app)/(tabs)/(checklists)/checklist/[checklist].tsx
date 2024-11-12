import "react-native-get-random-values";

import type { ChecklistPageQuery } from "@/__generated__/ChecklistPageQuery.graphql";
import Button from "@/components/Button";
import { CancelAndDiscardButton } from "@/components/CancelAndDiscardButton";
import { SaveAndFinishButton } from "@/components/SaveAndFinishButton";
import Separator from "@/components/Separator";
import { StartButton } from "@/components/StartButton";
import { SubmitButton } from "@/components/SubmitButton";
import { View } from "@/components/View";
import { ChecklistProgressBar } from "@/components/tendrel/ChecklistProgressBar.native";
import { ChecklistResultInlineView } from "@/components/tendrel/ChecklistResultInlineView.native";
import { ChecklistSection } from "@/components/tendrel/ChecklistSection.native";
import { ChecklistStatusButton } from "@/components/tendrel/ChecklistStatusButton.native";
import { Description } from "@/components/tendrel/Description.native";
import { DisplayName } from "@/components/tendrel/DisplayName.native";
import { Sop } from "@/components/tendrel/Sop.native";
import { useTheme } from "@/hooks/useTheme";
import { useTendrel } from "@/tendrel/provider";
import { BlurView } from "expo-blur";
import { useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, SafeAreaView } from "react-native";
import ActionSheet, { type ActionSheetRef } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { graphql, useLazyLoadQuery } from "react-relay";
import { match } from "ts-pattern";
export type ResultType = {
  id: number;
  name: string;
  value: string | number | null | boolean;
  required: boolean;
  type: "string input" | "boolean" | "counter";
};

export default function Page() {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const insets = useSafeAreaInsets();
  const { colors, colorTheme, inverseColors } = useTheme();
  const { t } = useTranslation();

  const { currentOrganization } = useTendrel();
  if (!currentOrganization) return null;

  const { checklist: checklistId } = useLocalSearchParams();

  const data = useLazyLoadQuery<ChecklistPageQuery>(
    graphql`
      query ChecklistPageQuery($nodeId: ID!) {
        node(id: $nodeId) {
          __typename
          ... on Checklist {
            id
            name {
              ...DisplayName_fragment
            }
            description {
              ...Description_fragment
            }
            items {
              edges {
                node {
                  __typename
                  ... on ChecklistResult {
                    id
                    widget {
                      __typename
                    }
                    ...ChecklistResultInlineView_fragment
                  }
                }
              }
              totalCount
            }
            sop {
              ...Sop_fragment
            }
            status {
              __typename
              ...ChecklistStatusButton_fragment
            }
            ...ChecklistProgressBar_fragment
          }
        }
      }
    `,
    {
      nodeId: checklistId as string,
    },
    {
      fetchPolicy: "store-and-network",
    },
  );

  if (data.node.__typename !== "Checklist") return null;

  const { node } = data;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, height: "100%" }}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <FlatList
              automaticallyAdjustKeyboardInsets
              data={node.items.edges.flatMap(({ node }) =>
                node.__typename === "ChecklistResult" ? node : [],
              )}
              ListHeaderComponentStyle={{ paddingRight: 3 }}
              ListHeaderComponent={
                <View
                  style={{
                    backgroundColor: colors.tendrel.background2.gray,
                    paddingRight: 5,
                  }}
                >
                  <View style={{ flexDirection: "row", padding: 10 }}>
                    <DisplayName
                      queryRef={node.name}
                      type="title"
                      style={{ flex: 1 }}
                    />
                    {node.status && (
                      <ChecklistStatusButton queryRef={node.status} />
                    )}
                  </View>
                  <Separator />
                  {node.description && (
                    <>
                      <Description queryRef={node.description} />
                      <Separator />
                    </>
                  )}
                  {node.sop && (
                    <>
                      <Sop queryRef={node.sop} />
                      <Separator />
                    </>
                  )}
                  {/* {started ? <WorkPhotos checklistId={checklist.id} /> : undefined} */}
                </View>
              }
              contentContainerStyle={{ paddingRight: 3 }}
              keyExtractor={node => node.id}
              renderItem={({ item }) => {
                if (item.widget.__typename === "SectionWidget") {
                  return <ChecklistSection parent={node.id} queryRef={item} />;
                }
                return (
                  <ChecklistResultInlineView
                    parent={node.id}
                    queryRef={item}
                    readOnly={node.status?.__typename !== "ChecklistInProgress"}
                  />
                );
              }}
            />
            <View style={{ flex: 0 }}>
              {match(node.status?.__typename)
                .with("ChecklistClosed", () => (
                  <View style={{ flexDirection: "row" }}>
                    {/* <BlurView */}
                    {/*   style={{ */}
                    {/*     position: "absolute", */}
                    {/*     bottom: 0, */}
                    {/*     width: "100%", // Button width, relative to screen width */}
                    {/*     paddingHorizontal: 20, */}
                    {/*     paddingVertical: 10, */}
                    {/*   }} */}
                    {/*   intensity={70} */}
                    {/*   tint="prominent" */}
                    {/* > */}
                    {/*   <StartButton node={node.id} /> */}
                    {/* </BlurView> */}
                  </View>
                ))
                .with("ChecklistInProgress", () => (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      paddingHorizontal: 10,
                      paddingTop: 15,
                      paddingBottom: 5,
                      backgroundColor: colors.tendrel.interactive1.gray,
                      alignItems: "center",
                      borderTopWidth: 0.5,
                      borderTopColor: colors.tendrel.border2.color,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <ChecklistProgressBar queryRef={node} />
                    </View>

                    <View
                      style={{
                        flex: 0.5,
                      }}
                    >
                      <Button
                        title={t("workScreen.finish.t")}
                        onPress={() => actionSheetRef.current?.show()}
                        variant="filled"
                        textColor={
                          colorTheme === "light"
                            ? inverseColors.tendrel.text2.color
                            : colors.tendrel.text2.color
                        }
                        color={colors.tendrel.button1.color}
                      />
                    </View>
                  </View>
                ))
                .otherwise(() => (
                  <View style={{ flexDirection: "row" }}>
                    <BlurView
                      style={{
                        bottom: 0,
                        width: "100%", // Button width, relative to screen width
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                      }}
                      intensity={70}
                      tint="prominent"
                    >
                      <StartButton node={node.id} />
                    </BlurView>
                  </View>
                ))}
            </View>
          </View>
        </View>
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
            <ChecklistProgressBar queryRef={node} />
            <SaveAndFinishButton />
            <CancelAndDiscardButton node={node.id} />
            <SubmitButton node={node.id} />
          </View>
        </ActionSheet>
      </View>
    </SafeAreaView>
  );
}
