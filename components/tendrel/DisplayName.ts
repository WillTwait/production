import { graphql } from "relay-runtime";

export const DisplayName$fragment = graphql`
  fragment DisplayName_fragment on DisplayName {
    id
    name {
      ...DynamicString_fragment
    }
  }
`;

export type {
  DisplayName_fragment$data as DisplayName$data,
  DisplayName_fragment$key as DisplayName$key,
} from "@/__generated__/DisplayName_fragment.graphql";
