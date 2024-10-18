import { Circle } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { Text } from "components/shared";
import { useState, useEffect } from "react";

const RecordTimer = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <Stack sx={{ flexDirection: "row", gap: 1, alignItems: "center" }}>
      <Circle color="error" />
      <Text variant="body2" color="GrayText">
        {formatTime(seconds)}
      </Text>
    </Stack>
  );
};

export default RecordTimer;
