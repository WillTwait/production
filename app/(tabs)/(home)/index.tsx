import type { HomeScreenQuery } from "@/__generated__/HomeScreenQuery.graphql";
import { ActiveConnectionView } from "@/components/ActiveConnectionView";
import { Text } from "@/components/Text";
import { View } from "@/components/View";
import { useMigrationHelper } from "@/db/drizzle";
import { useTendrel } from "@/tendrel/provider";
import React from "react";
import { graphql, useLazyLoadQuery } from "react-relay";

export default function Page() {
  const { success, error } = useMigrationHelper();
  const { currentOrganization } = useTendrel();

  // FIXME: murphy - move the migration up to the root & use splash screen component? ie dont hide splash screen until migrated
  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  if (!currentOrganization) {
    return null;
  }

  return <Content customerId={currentOrganization.id} />;
}

function Content({ customerId }: { customerId: string }) {
  const data = useLazyLoadQuery<HomeScreenQuery>(
    graphql`
      query HomeScreenQuery($parent: ID!) {
        ...ActiveConnectionView_fragment @arguments(parent: $parent)
      }
    `,
    {
      parent: customerId,
    },
  );

  return (
    <ActiveConnectionView
      parent={customerId}
      queryRef={data}
      initialWithActive={true}
      initialWithStatus={["open"]}
    />
  );
}
