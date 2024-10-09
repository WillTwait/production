import { graphql } from "relay-runtime";

export const Status$fragment = graphql`
  fragment Status_fragment on ChecklistStatus {
    __typename
    ... on ChecklistOpen {
      openedAt {
        ...Temporal_fragment
      }
    }
    ... on ChecklistInProgress {
      inProgressAt {
        ...Temporal_fragment
      }
    }
    ... on ChecklistClosed {
      closedAt {
        ...Temporal_fragment
      }
    }
  }
`;

export type {
  Status_fragment$data as Status$data,
  Status_fragment$key as Status$key,
} from "@/__generated__/Status_fragment.graphql";
