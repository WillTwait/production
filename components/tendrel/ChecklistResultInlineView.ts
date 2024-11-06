import { graphql } from "relay-runtime";

export const ChecklistResultInlineView$fragment = graphql`
  fragment ChecklistResultInlineView_fragment on ChecklistResult {
    id
    name {
      ...DisplayName_fragment
    }
    required
    status {
      __typename
      ... on ChecklistOpen {
        dueAt {
          epochMilliseconds
        }
      }
      ... on ChecklistInProgress {
        dueAt {
          epochMilliseconds
        }
      }
      ... on ChecklistClosed {
        closedBecause {
          code
        }
      }
    }
    widget {
      ... on BooleanWidget {
        __typename
        ...BooleanWidget_reader_fragment
        ...BooleanWidget_writer_fragment
      }
      ... on CheckboxWidget {
        __typename
      }
      ... on ClickerWidget {
        __typename
        ...ClickerWidget_reader_fragment
        ...ClickerWidget_writer_fragment
      }
      ... on MultilineStringWidget {
        __typename
        ...MultilineStringWidget_reader_fragment
        ...MultilineStringWidget_writer_fragment
      }
      ... on NumberWidget {
        __typename
        ...NumberWidget_reader_fragment
        ...NumberWidget_writer_fragment
      }
      ... on SentimentWidget {
        __typename
        ...SentimentWidget_reader_fragment
        ...SentimentWidget_writer_fragment
      }
      ... on StringWidget {
        __typename
        ...StringWidget_reader_fragment
        ...StringWidget_writer_fragment
      }
      ... on TemporalWidget {
        __typename
      }
    }
  }
`;

export type {
  ChecklistResultInlineView_fragment$data as ChecklistResultInlineView$data,
  ChecklistResultInlineView_fragment$key as ChecklistResultInlineView$key,
} from "@/__generated__/ChecklistResultInlineView_fragment.graphql";
