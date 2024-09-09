import { Text } from "@/components/Text";
import useThemeContext from "@/hooks/useTendyTheme";
import { DateTime, Duration } from "luxon";
import { useEffect, useRef, useState } from "react";

interface Props {
  startTime: DateTime;
}
export default function Timer({ startTime }: Props) {
  const durationInSeconds = Math.abs(
    startTime.diff(DateTime.now()).as("seconds"),
  );
  const duration = Duration.fromObject({ seconds: durationInSeconds });
  const { colors } = useThemeContext();
  const [displayTime, setDisplayTime] = useState(duration.toFormat("hh:mm:ss"));

  const countRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );

  useEffect(() => {
    countRef.current = setInterval(() => {
      const durationInSeconds = Math.abs(
        startTime.diff(DateTime.now()).as("seconds"),
      );
      const duration = Duration.fromObject({ seconds: durationInSeconds });
      setDisplayTime(duration.toFormat("hh:mm:ss"));
    }, 1000);

    return () => {
      return clearInterval(countRef.current);
    };
  }, [startTime.diff]);

  return (
    <Text style={{ color: colors.tendrel.text2.color }}>{displayTime}</Text>
  );
}
