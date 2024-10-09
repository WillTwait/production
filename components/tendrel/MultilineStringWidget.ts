import { graphql } from "relay-runtime";

export const ReaderFragment = graphql`
  fragment MultilineStringWidget_reader_fragment on MultilineStringWidget {
    string
  }
`;

export const WriterFragment = graphql`
  fragment MultilineStringWidget_writer_fragment on MultilineStringWidget
  @updatable {
    string
  }
`;

export type { MultilineStringWidget_reader_fragment$key as ReaderFragmentRef } from "@/__generated__/MultilineStringWidget_reader_fragment.graphql";

export type { MultilineStringWidget_writer_fragment$key as WriterFragmentRef } from "@/__generated__/MultilineStringWidget_writer_fragment.graphql";
