import { graphql } from "relay-runtime";

export const Sop$fragment = graphql`
  fragment Sop_fragment on Sop {
    sop
  }
`;

export type {
  Sop_fragment$data as Sop$data,
  Sop_fragment$key as Sop$key,
} from "@/__generated__/Sop_fragment.graphql";
