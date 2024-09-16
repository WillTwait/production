import { Text } from "@/components/Text";
import useThemeContext from "@/hooks/useTendyTheme";
import { DateTime, Duration } from "luxon";
import { useEffect, useState } from "react";

interface Props {
  startTime: DateTime;
}

export default function Timer({ startTime }: Props) {
  const { colors } = useThemeContext();

  // Function to compute the duration and format it
  function formatDurationFromNow() {
    const durationInSeconds = Math.abs(
      startTime.diff(DateTime.now()).as("seconds"),
    );
    const duration = Duration.fromObject({ seconds: durationInSeconds });
    return duration.hours > 0
      ? duration.toFormat("h:mm:ss")
      : duration.toFormat("mm:ss");
  }

  const [displayTime, setDisplayTime] = useState(formatDurationFromNow);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDisplayTime(formatDurationFromNow());
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <Text style={{ color: colors.tendrel.text2.color }}>{displayTime}</Text>
  );
}
