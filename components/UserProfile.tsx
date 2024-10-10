import { useTheme } from "@/hooks/useTheme";
import { useTendrel } from "@/tendrel/provider";
import { useAuth } from "@clerk/clerk-expo";
import { Building2 } from "lucide-react-native";
import { type RefObject, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import ActionSheet, { type ActionSheetRef } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as DropdownMenu from "zeego/dropdown-menu";
import Avatar from "./Avatar";
import Button from "./Button";
import Separator from "./Separator";
import { Text } from "./Text";

interface Props {
  actionSheetRef: RefObject<ActionSheetRef>;
}

export function UserProfile({ actionSheetRef }: Props) {
  const { organizations, currentOrganization, setOrganization, user } =
    useTendrel();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const { t } = useTranslation();

  // FIXME: This causes the actionSheet to *always* show, since presumably
  // currentOrganization is not set on initial render?
  // Force user to select organization on initial load
  useEffect(() => {
    if (!currentOrganization) {
      actionSheetRef.current?.show();
    }
  }, [actionSheetRef, currentOrganization]);

  const { firstName, lastName, displayName } = user;

  return (
    <ActionSheet
      ref={actionSheetRef}
      safeAreaInsets={insets}
      containerStyle={{
        height: "50%",
        backgroundColor: colors.tendrel.background1.color,
        padding: 5,
      }}
      animated
      closable={currentOrganization !== null}
      headerAlwaysVisible
      CustomHeaderComponent={
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            justifyContent: "center",
            padding: 4,
          }}
        >
          <Avatar
            fallback={`${firstName.at(0)?.toUpperCase()}${lastName.at(0)?.toUpperCase()}`}
            size={45}
          />
          <Text type="title">{displayName}</Text>
        </View>
      }
    >
      <View style={{ height: "100%" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View>
              <Building2
                color={colors.tendrel.text1.gray}
                style={{ marginRight: 10 }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text type="subtitle" numberOfLines={3} ellipsizeMode="tail">
                {currentOrganization?.name ??
                  t("currentUser.selectAnOrganization.override")}
              </Text>
            </View>
          </View>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button title={t("currentUser.switchCustomer.t")} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              loop
              side="bottom"
              align="start"
              sideOffset={5}
              alignOffset={0}
              avoidCollisions
              collisionPadding={8}
            >
              <DropdownMenu.Label>
                {t("currentUser.selectCustomer.t")}
              </DropdownMenu.Label>
              {organizations.map(customer => (
                <DropdownMenu.Item
                  key={customer.id}
                  onSelect={() => setOrganization(customer)}
                >
                  <DropdownMenu.ItemIcon
                    ios={{
                      name:
                        customer.name === currentOrganization?.name
                          ? "checkmark.circle.fill"
                          : undefined,
                    }}
                  />
                  <DropdownMenu.ItemTitle>
                    {customer.name}
                  </DropdownMenu.ItemTitle>
                </DropdownMenu.Item>
              ))}
              <DropdownMenu.Separator />
              <DropdownMenu.Arrow />
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </View>
      </View>
      <View
        style={{
          marginTop: "auto",
          alignItems: "flex-end",
        }}
      >
        <Separator />
        <Button title={t("currentUser.logout.t")} onPress={() => signOut()} />
      </View>
    </ActionSheet>
  );
}
