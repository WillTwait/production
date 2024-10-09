import { graphql } from "react-relay";

export const Temporal$fragment = graphql`
  fragment Temporal_fragment on Temporal {
    __typename
    ... on Instant {
      ...TemporalInstant_fragment
    }
    ... on ZonedDateTime {
      ...TemporalZonedDateTime_fragment
    }
  }
`;

export type {
  Temporal_fragment$data as Temporal$data,
  Temporal_fragment$key as Temporal$key,
} from "@/__generated__/Temporal_fragment.graphql";

export const TemporalInstant$fragment = graphql`
  fragment TemporalInstant_fragment on Instant {
    epochMilliseconds
  }
`;

export type {
  TemporalInstant_fragment$data as TemporalInstant$data,
  TemporalInstant_fragment$key as TemporalInstant$key,
} from "@/__generated__/TemporalInstant_fragment.graphql";

export const TemporalZonedDateTime$fragment = graphql`
  fragment TemporalZonedDateTime_fragment on ZonedDateTime {
    epochMilliseconds
    timeZone
  }
`;

export type {
  TemporalZonedDateTime_fragment$data as TemporalZonedDateTime$data,
  TemporalZonedDateTime_fragment$key as TemporalZonedDateTime$key,
} from "@/__generated__/TemporalZonedDateTime_fragment.graphql";
