import { graphql } from "relay-runtime";

export const Assignee$fragment = graphql`
  fragment Assignee_fragment on Assignee {
    id
    assignedTo {
      __typename
      ... on Worker {
        firstName
        lastName
      }
    }
  }
`;

export type {
  Assignee_fragment$data as Assignee$data,
  Assignee_fragment$key as Assignee$key,
} from "@/__generated__/Assignee_fragment.graphql";
