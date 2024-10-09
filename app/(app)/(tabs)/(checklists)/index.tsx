import type { ChecklistsQuery } from "@/__generated__/ChecklistsQuery.graphql";
import { ActiveConnectionView } from "@/components/ActiveConnectionView";
import { useTendrel } from "@/tendrel/provider";
import React from "react";
import { graphql, useLazyLoadQuery } from "react-relay";

export default function Page() {
  const { currentOrganization } = useTendrel();
  if (!currentOrganization) {
    return null;
  }

  return <Content customerId={currentOrganization.id} />;
}

function Content({ customerId }: { customerId: string }) {
  const data = useLazyLoadQuery<ChecklistsQuery>(
    graphql`
      query ChecklistsQuery($parent: ID!) {
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
