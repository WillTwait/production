import { graphql } from "relay-runtime";

export const ReaderFragment = graphql`
  fragment StringWidget_reader_fragment on StringWidget {
    string
  }
`;

export type { StringWidget_reader_fragment$key as ReaderFragmentRef } from "@/__generated__/StringWidget_reader_fragment.graphql";

export const WriterFragment = graphql`
  fragment StringWidget_writer_fragment on StringWidget @updatable {
    string
  }
`;

export type { StringWidget_writer_fragment$key as WriterFragmentRef } from "@/__generated__/StringWidget_writer_fragment.graphql";
