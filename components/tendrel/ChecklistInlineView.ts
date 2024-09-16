import { graphql } from "react-relay";

export const ChecklistInlineView$fragment = graphql`
  fragment ChecklistInlineView on Checklist {
    id
    assignees {
      edges {
        node {
          assignedTo {
              ... on Worker {
                  displayName
                  firstName
                  lastName
          }

          }
        }
      }
      totalCount
    }
    name {
      value { value }
    }
    status {
     __typename
      ... on ChecklistOpen {
        openedAt {
          ... on Instant {
            epochMilliseconds
          }
          ... on ZonedDateTime {
            epochMilliseconds
          }
        }
      },
      ... on ChecklistClosed {
      closedAt {
        ... on Instant {
          epochMilliseconds
        }
        ... on ZonedDateTime {
          epochMilliseconds
        }
      }
      }
    }
  }
`;

export type {
  ChecklistInlineView$data,
  ChecklistInlineView$key,
} from "@/__generated__/ChecklistInlineView.graphql";
