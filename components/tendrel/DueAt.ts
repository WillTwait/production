import { graphql } from "relay-runtime";

export const DueAt$fragment = graphql`
  fragment DueAt_fragment on ChecklistStatus {
    ... on ChecklistOpen {
      dueAt {
        ...Temporal_fragment
      }
    }
    ... on ChecklistInProgress {
      dueAt {
        ...Temporal_fragment
      }
    }
    ... on ChecklistClosed {
      dueAt {
        ...Temporal_fragment
      }
    }
  }
`;

export type { DueAt_fragment$key as DueAt$key } from "@/__generated__/DueAt_fragment.graphql";
