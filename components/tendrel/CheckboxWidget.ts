import { graphql } from "relay-runtime";

export const ReaderFragment = graphql`
  fragment CheckboxWidget_reader_fragment on CheckboxWidget {
    checked
  }
`;

export type { CheckboxWidget_reader_fragment$key as ReaderFragmentRef } from "@/__generated__/CheckboxWidget_reader_fragment.graphql";

export const WriterFragment = graphql`
  fragment CheckboxWidget_writer_fragment on CheckboxWidget @updatable {
    checked
  }
`;

export type { CheckboxWidget_writer_fragment$key as WriterFragmentRef } from "@/__generated__/CheckboxWidget_writer_fragment.graphql";
