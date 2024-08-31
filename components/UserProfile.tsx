import useThemeContext from "@/hooks/useTendyTheme";
import { Building2, Warehouse } from "lucide-react-native";
import { type RefObject, useState } from "react";
import { View } from "react-native";
import ActionSheet, { type ActionSheetRef } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Avatar from "./Avatar";
import Button from "./Button";
import Seperator from "./Separator";
import { Text } from "./Text";

import { useAuth } from "@clerk/clerk-expo";
import { useTranslation } from "react-i18next";
import * as DropdownMenu from "zeego/dropdown-menu";

interface Props {
  actionSheetRef: RefObject<ActionSheetRef>;
}

//FIXME: Temp for time being
const customers = Array.from({ length: 15 }, (_, i) => ({
  key: `customer-${i + 1}`,
  name: `Customer ${i + 1}`,
}));

//FIXME: Temp for time being
const sites = Array.from({ length: 15 }, (_, i) => ({
  key: `site-${i + 1}`,
  name: `Site ${i + 1}`,
}));

export function UserProfile({ actionSheetRef }: Props) {
  const { colors } = useThemeContext();
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const { t } = useTranslation();

  const [currentCustomer, setCurrentCustomer] = useState(customers[0]);
  const [currentSite, setCurrentSite] = useState(customers[0]);

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
      closable
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
          //FIXME: Make real
          <Avatar firstName="Fedes" lastName="Fan" size={45} />
          <Text type="title">Fedes #1 Fan</Text>
        </View>
      }
    >
      <View style={{ height: "100%" }}>
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", flex: 1, gap: 5 }}>
              <Building2 color={colors.tendrel.text1.gray} />
              <Text type="subtitle">{currentCustomer.name}</Text>
            </View>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button
                  title={t("currentUser.switchCustomer.t").capitalize()}
                />
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
                  {t("currentUser.selectCustomer.t").capitalize()}
                </DropdownMenu.Label>
                {customers.map(customer => (
                  <DropdownMenu.Item
                    key={customer.key}
                    onSelect={() => setCurrentCustomer(customer)}
                  >
                    <DropdownMenu.ItemIcon
                      ios={{
                        name:
                          customer.name === currentCustomer.name
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                gap: 5,
              }}
            >
              <Warehouse color={colors.tendrel.text1.gray} />
              <Text type="subtitle">{currentSite.name}</Text>
            </View>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button title={t("currentUser.switchSite.t").capitalize()} />
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
                  {t("currentUser.selectSite.t").capitalize()}
                </DropdownMenu.Label>
                {sites.map(site => (
                  <DropdownMenu.Item
                    key={site.key}
                    onSelect={() => setCurrentSite(site)}
                  >
                    <DropdownMenu.ItemIcon
                      ios={{
                        name:
                          site.name === currentSite.name
                            ? "checkmark.circle.fill"
                            : undefined,
                      }}
                    />
                    <DropdownMenu.ItemTitle>{site.name}</DropdownMenu.ItemTitle>
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
          <Seperator />
          <Button
            title={t("currentUser.logout.t").capitalize()}
            onPress={() => signOut()}
          />
        </View>
      </View>
    </ActionSheet>
  );
}
