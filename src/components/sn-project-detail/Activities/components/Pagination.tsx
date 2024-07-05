import { memo } from "react";
import { Stack, Divider } from "@mui/material";
import ChevronIcon from "icons/ChevronIcon";
import { IconButton } from "components/shared";

const Pagination = () => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      border="1px solid"
      borderRadius={1}
      borderColor="grey.100"
    >
      <IconButton disableRipple>
        <ChevronIcon sx={{ transform: "rotate(90deg)", color: "grey.400" }} />
      </IconButton>
      <Divider orientation="vertical" />
      <IconButton disableRipple>
        <ChevronIcon sx={{ transform: "rotate(-90deg)", color: "grey.400" }} />
      </IconButton>
    </Stack>
  );
};

export default memo(Pagination);
