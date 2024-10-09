import { Text } from "@/components/Text";
import { useTheme } from "@/hooks/useTheme";
import { DateTime, Duration } from "luxon";
import { useCallback, useEffect, useState } from "react";

interface Props {
  startTime: DateTime;
}

export default function Timer({ startTime }: Props) {
  const { colors } = useTheme();

  const formatDurationFromNow = useCallback(() => {
    const durationInSeconds = Math.abs(
      startTime.diff(DateTime.now()).toMillis(),
    );
    const duration = Duration.fromMillis(durationInSeconds);
    return duration.as("hours") > 0
      ? duration.toFormat("h:mm:ss")
      : duration.toFormat("mm:ss");
  }, [startTime]);

  const [displayTime, setDisplayTime] = useState(formatDurationFromNow);

  useEffect(() => {
    const t = setInterval(() => setDisplayTime(formatDurationFromNow()), 1000);
    return () => clearInterval(t); // Cleanup interval on component unmount
  }, [formatDurationFromNow]);

  return (
    <Text style={{ color: colors.tendrel.text2.color }}>{displayTime}</Text>
  );
}
