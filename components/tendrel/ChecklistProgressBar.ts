import { graphql } from "relay-runtime";

export const ChecklistProgressBar$fragment = graphql`
  fragment ChecklistProgressBar_fragment on Checklist {
    items {
      totalCount
      edges {
        node {
          ... on Checklist {
            status {
              ... on ChecklistClosed {
                __typename
              }
            }
          }
          ... on ChecklistResult {
            status {
              ... on ChecklistClosed {
                __typename
              }
            }
          }
        }
      }
    }
  }
`;

export type {
  ChecklistProgressBar_fragment$data as ChecklistProgressBar$data,
  ChecklistProgressBar_fragment$key as ChecklistProgressBar$key,
} from "@/__generated__/ChecklistProgressBar_fragment.graphql";
