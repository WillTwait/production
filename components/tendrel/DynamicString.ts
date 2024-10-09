import { graphql } from "react-relay";

export const DynamicString$fragment = graphql`
  fragment DynamicString_fragment on DynamicString {
    __id
    locale
    value
  }
`;

export type {
  DynamicString_fragment$data as DynamicString$data,
  DynamicString_fragment$key as DynamicString$key,
} from "@/__generated__/DynamicString_fragment.graphql";
