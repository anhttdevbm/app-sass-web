import { memo } from "react";
import { Box, Stack } from "@mui/material";
import { Text } from "components/shared";
import { formatDate, formatNumber } from "utils/index";
import { CostHistory } from "store/company/reducer";
import { DATE_TIME_FORMAT_SLASH } from "constant/index";

const Item = (props: CostHistory) => {
  const { time, payer, receiver, value } = props;

  return (
    <Stack
      direction="row"
      alignItems="center"
      borderBottom="1px solid"
      borderColor="grey.100"
      py={{ xs: 1, sm: 1.25 }}
      px={{ xs: 1, sm: 1.75 }}
      spacing={{ xs: 1.25, sm: 2 }}
    >
      <Text textAlign="center" variant="caption" color="grey.400" width={64}>
        {formatDate(time, DATE_TIME_FORMAT_SLASH)}
      </Text>
      <Box
        sx={{
          width: 8,
          minWidth: 8,
          height: 8,
          borderRadius: "50%",
          bgcolor: "secondary.main",
        }}
      />
      <Text variant="h6" color="grey.400" sx={{ wordBreak: "break-all" }}>
        <Text
          noWrap
          component="span"
          variant="inherit"
          color="primary.main"
          mr={0.75}
        >
          {payer}
        </Text>
        complete payment
        <Text
          noWrap
          component="span"
          variant="inherit"
          color="primary.main"
          mx={0.75}
        >
          {receiver}
        </Text>
        {formatNumber(value)}
      </Text>
    </Stack>
  );
};

export default memo(Item);
