import { graphql } from "relay-runtime";

export const Description$fragment = graphql`
  fragment Description_fragment on Description {
    description {
      ...DynamicString_fragment
    }
  }
`;

export type {
  Description_fragment$data as Description$data,
  Description_fragment$key as Description$key,
} from "@/__generated__/Description_fragment.graphql";