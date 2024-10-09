import { graphql } from "react-relay";

export const ChecklistInlineView$fragment = graphql`
  fragment ChecklistInlineView on Checklist {
    id
    assignees {
      edges {
        node {
          ...Assignee_fragment
        }
      }
      totalCount
    }
    name {
      ...DisplayName_fragment
    }
    parent {
      status {
        ... on ChecklistClosed {
          closedAt {
            ...Temporal_fragment
          }
        }
      }
    }
    status {
      __typename
      ... on ChecklistOpen {
        dueAt {
          epochMilliseconds
        }
        openedAt {
          ...Temporal_fragment
        }
      }
      ... on ChecklistInProgress {
        dueAt {
          epochMilliseconds
        }
        inProgressAt {
          ...Temporal_fragment
        }
        ...ChecklistTimer_fragment
      }
      ... on ChecklistClosed {
        closedAt {
          ...Temporal_fragment
        }
        closedBecause {
          code
        }
      }
      ...DueAt_fragment
    }
  }
`;

export type {
  ChecklistInlineView$data,
  ChecklistInlineView$key,
} from "@/__generated__/ChecklistInlineView.graphql";
