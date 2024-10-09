import { graphql } from "relay-runtime";

export const ReaderFragment = graphql`
  fragment NumberWidget_reader_fragment on NumberWidget {
    number
  }
`;

export type { NumberWidget_reader_fragment$key as ReaderFragmentRef } from "@/__generated__/NumberWidget_reader_fragment.graphql";

export const WriterFragment = graphql`
  fragment NumberWidget_writer_fragment on NumberWidget @updatable {
    number
  }
`;

export type { NumberWidget_writer_fragment$key as WriterFragmentRef } from "@/__generated__/NumberWidget_writer_fragment.graphql";
