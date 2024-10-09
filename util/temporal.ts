import "@formatjs/intl-durationformat/polyfill";
import "@formatjs/intl-getcanonicallocales/polyfill";
import "@formatjs/intl-listformat/polyfill";
import "@formatjs/intl-listformat/locale-data/en";
import "@formatjs/intl-locale/polyfill";

import { Temporal } from "@js-temporal/polyfill";

export function formatDuration(d: Temporal.Duration, locale = "en") {
  if (d.hours) {
    return `${d.hours.toLocaleString(locale, { minimumIntegerDigits: 2 })}:${d.minutes.toLocaleString(locale, { minimumIntegerDigits: 2 })}:${d.seconds.toLocaleString(locale, { minimumIntegerDigits: 2 })}`;
  }

  return `${d.minutes.toLocaleString(locale, { minimumIntegerDigits: 2 })}:${d.seconds.toLocaleString(locale, { minimumIntegerDigits: 2 })}`;
}

export function since(dt: Temporal.Instant) {
  return Temporal.Now.instant().since(dt, {
    smallestUnit: "second",
    largestUnit: "hours",
  });
}

export function toInstant(epoch: string) {
  return Temporal.Instant.fromEpochMilliseconds(+epoch);
}

export function toZonedDateTime(epoch: string, timeZone: string) {
  return toInstant(epoch).toZonedDateTimeISO(timeZone);
}
