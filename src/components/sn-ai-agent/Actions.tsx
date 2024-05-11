"use client";

import PlusIcon from "@mui/icons-material/Add";
import { SelectChangeEvent, Stack } from "@mui/material";
import useTheme from "hooks/useTheme";
import React from "react";
import { Button, SearchInput, StatusSelect } from "./components";

const Actions = () => {
  const [status, setStatus] = React.useState("");
  const theme = useTheme();

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setStatus(event.target.value as string);
  };

  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        padding={"12px 24px"}
        borderBottom={`1px solid ${theme.palette.info.light}`}
        height={"80px"}
      >
        <Stack>
          <Button type="gradient" text="Create" icon={PlusIcon} />
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          border={`1px solid ${theme.palette.info.light}`}
          padding={"12px"}
          borderRadius={"4px"}
          alignItems={"center"}
          height={"100%"}
        >
          <SearchInput theme={theme} />
          <StatusSelect
            status={status}
            setStatus={setStatus}
            handleChangeStatus={handleStatusChange}
            theme={theme}
          />
        </Stack>
      </Stack>
    </>
  );
};

export default Actions;
