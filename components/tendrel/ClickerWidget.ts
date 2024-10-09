import { graphql } from "relay-runtime";

export const ReaderFragment = graphql`
  fragment ClickerWidget_reader_fragment on ClickerWidget {
    number
  }
`;

export type { ClickerWidget_reader_fragment$key as ReaderFragmentRef } from "@/__generated__/ClickerWidget_reader_fragment.graphql";

export const WriterFragment = graphql`
  fragment ClickerWidget_writer_fragment on ClickerWidget @updatable {
    number
  }
`;

export type { ClickerWidget_writer_fragment$key as WriterFragmentRef } from "@/__generated__/ClickerWidget_writer_fragment.graphql";
