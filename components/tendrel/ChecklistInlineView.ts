import { graphql } from "react-relay";

export const ChecklistInlineView$fragment = graphql`
  fragment ChecklistInlineView on Checklist {
    assignees {
      edges {
        node {
          assignedTo {
            user {
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
      ... on ChecklistOpen {
        openedAt {
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
