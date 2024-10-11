import { graphql } from "relay-runtime";

export const ReaderFragment = graphql`
fragment SentimentWidget_reader_fragment on SentimentWidget {
  number
}
`;

export type { SentimentWidget_reader_fragment$key as ReaderFragmentRef } from "@/__generated__/SentimentWidget_reader_fragment.graphql";

export const WriterFragment = graphql`
fragment SentimentWidget_writer_fragment on SentimentWidget @updatable {
  number
}
`;

export type { SentimentWidget_writer_fragment$key as WriterFragmentRef } from "@/__generated__/SentimentWidget_writer_fragment.graphql";
