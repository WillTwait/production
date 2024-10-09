import { intlFormatDistance } from "@/util/intlFormatDistancePolyfill";
import { toInstant, toZonedDateTime } from "@/util/temporal";
import { Temporal as JsTemporal } from "@js-temporal/polyfill";
import type { IntlFormatDistanceOptions } from "date-fns";
import type { TextProps } from "react-native";
import { useFragment } from "react-relay";
import { Text } from "../Text";
import {
  Temporal$fragment,
  type Temporal$key,
  TemporalInstant$fragment,
  type TemporalInstant$key,
  TemporalZonedDateTime$fragment,
  type TemporalZonedDateTime$key,
} from "./Temporal";

type Variant =
  | {
      variant?: undefined;
      locale?: string;
      options?: Intl.DateTimeFormatOptions;
      style?: TextProps["style"];
    }
  | {
      variant: "distance";
      locale?: string;
      options?: IntlFormatDistanceOptions;
      style?: TextProps["style"];
    };
type Props = Variant & { queryRef: Temporal$key };

export type { Props as TemporalProps, Variant as TemporalVariant };

export function Temporal({ queryRef, ...props }: Props) {
  const data = useFragment(Temporal$fragment, queryRef);
  switch (data.__typename) {
    case "Instant":
      return <Instant queryRef={data} {...props} />;
    case "ZonedDateTime":
      return <ZonedDateTime queryRef={data} {...props} />;
    default:
      return null;
  }
}

type InstantProps = Variant & { queryRef: TemporalInstant$key };

export function Instant(props: InstantProps) {
  const { locale, queryRef } = props;
  const data = useFragment(TemporalInstant$fragment, queryRef);

  const dt = toInstant(data.epochMilliseconds);

  if (props.variant === "distance") {
    return (
      <Text style={props.style}>
        {intlFormatDistance(dt.epochMilliseconds, new Date(), {
          locale,
          ...(props.options ?? {}),
        })}
      </Text>
    );
  }

  return (
    <Text style={props.style}>{dt.toLocaleString(locale, props.options)}</Text>
  );
}

type ZonedProps = Variant & {
  queryRef: TemporalZonedDateTime$key;
};

export function ZonedDateTime(props: ZonedProps) {
  const { locale, queryRef } = props;
  const data = useFragment(TemporalZonedDateTime$fragment, queryRef);

  const dt = toZonedDateTime(data.epochMilliseconds, data.timeZone);

  if (props.variant === "distance") {
    return (
      <Text style={props.style}>
        {intlFormatDistance(dt.epochMilliseconds, new Date(), {
          locale,
          ...(props.options ?? {}),
        })}
      </Text>
    );
  }

  return (
    <Text style={props.style}>{dt.toLocaleString(locale, props.options)}</Text>
  );
}
