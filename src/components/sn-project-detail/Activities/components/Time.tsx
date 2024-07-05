import { memo } from "react";
import { Box, Stack } from "@mui/material";
import useTheme from "hooks/useTheme";
import { Text } from "components/shared";
import { formatDate } from "utils/index";
import { SHORT_TIME_FORMAT } from "constant/index";

type TimeProps = {
  value?: string | number;
  topDivider?: boolean;
  bottomDivider?: boolean;
};

const Time = (props: TimeProps) => {
  const { value, topDivider = true, bottomDivider = true } = props;
  const { isDarkMode } = useTheme();

  return (
    <Stack alignItems="center" justifyContent="center">
      <Box
        borderLeft="1px dashed"
        width="1px"
        borderColor={topDivider ? "grey.100" : "transparent"}
        height="100%"
      />
      <Stack
        width={56}
        height={56}
        minHeight={56}
        alignItems="center"
        justifyContent="center"
        borderRadius="50%"
        bgcolor={isDarkMode ? "grey.50" : "primary.light"}
      >
        <Text variant="h5" color="primary.main">
          {formatDate(value, SHORT_TIME_FORMAT)}
        </Text>
      </Stack>
      <Box
        borderLeft="1px dashed"
        width="1px"
        borderColor={bottomDivider ? "grey.100" : "transparent"}
        height="100%"
      />
    </Stack>
  );
};

export default memo(Time);
