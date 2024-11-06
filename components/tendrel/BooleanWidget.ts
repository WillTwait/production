import { graphql } from "relay-runtime";

export const ReaderFragment = graphql`
  fragment BooleanWidget_reader_fragment on BooleanWidget {
    checked
  }
`;

export type { BooleanWidget_reader_fragment$key as ReaderFragmentRef } from "@/__generated__/BooleanWidget_reader_fragment.graphql";

export const WriterFragment = graphql`
  fragment BooleanWidget_writer_fragment on BooleanWidget @updatable {
    checked
  }
`;

export type { BooleanWidget_writer_fragment$key as WriterFragmentRef } from "@/__generated__/BooleanWidget_writer_fragment.graphql";
