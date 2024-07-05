import { memo, useMemo } from "react";
import { AlertColor, Stack } from "@mui/material";
import { Text } from "components/shared";
import { formatNumber } from "utils/index";
import ArrowIcon from "icons/ArrowIcon";

type StatisticItemProps = {
  color: AlertColor | "primary";
  icon: React.ReactNode;
  label: string;
  value?: number;
  percent?: number;
  increment?: boolean;
};

const StatisticItem = (props: StatisticItemProps) => {
  const { color, icon, value, label, percent, increment } = props;

  const colorValue = useMemo(
    () => (increment ? "success" : "error"),
    [increment],
  );

  return (
    <Stack
      spacing={2.5}
      direction="row"
      // justifyContent={{ xs: "space-between", md: "initial" }}
    >
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{
          width: 90,
          height: 84,
          borderRadius: "50%",
          bgcolor: ({ palette }) => palette?.[color]?.light,
          color: ({ palette }) => palette?.[color]?.main,
          "& svg": {
            fontSize: 42,
          },
        }}
      >
        {icon}
      </Stack>
      <Stack>
        <Text variant="body2" color="grey.300">
          {label}
        </Text>
        <Text variant="h2">{formatNumber(value)}</Text>
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <ArrowIcon
            color={colorValue}
            sx={{ transform: `rotate(${increment ? 90 : -90}deg)` }}
          />
          <Text
            variant="body2"
            color={({ palette }) => palette?.[colorValue]?.main}
          >
            {formatNumber(percent, { suffix: "%", space: false })}
          </Text>
          <Text variant="body2">this month</Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default memo(StatisticItem);
