"use client";

import PlusIcon from "@mui/icons-material/Add";
import { SelectChangeEvent, Stack } from "@mui/material";
import { NS_AI_AGENT } from "constant/index";
import useTheme from "hooks/useTheme";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import {
  Button,
  CreateAIAgentModal,
  SearchInput,
  StatusSelect,
} from "./components";
import { getPath } from "utils/index";
import useQueryParams from "hooks/useQueryParams";
import { usePathname, useRouter } from "next-intl/client";
import { useAIAgent } from "store/aiAgent/selectors";
import useDebounce from "hooks/useDebounce";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

const Actions = () => {
  const { onGetAgents } = useAIAgent();
  const { initQuery, isReady, query } = useQueryParams();
  const { push } = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const t = useTranslations(NS_AI_AGENT);

  const [onSearch] = useDebounce((newQueries: Params) => {
    handleQueryChange(newQueries);
  }, 500);
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleQueryChange = (newQueries: Params) => {
    const updatedQueries = { ...query, ...newQueries };
    const updatedPath = getPath(pathname, updatedQueries);

    push(updatedPath);
    onGetAgents(updatedQueries);
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setStatus(event.target.value as string);
    handleQueryChange({ status: event.target.value });
  };

  const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch({ search: e.target.value });
  }

  const handleCloseCreateModal = () => {
    setOpen(false);
  };

  const handleOpenCreateModal = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (!isReady) return;
    onGetAgents({ ...initQuery });
  }, [initQuery, isReady, onGetAgents]);

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
          <Button
            type="gradient"
            text={t("layout.header.create")}
            icon={PlusIcon}
            onClick={handleOpenCreateModal}
          />
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
          <SearchInput
            theme={theme}
            placeholder={t("layout.header.search")}
            onChange={handleOnChangeSearch}
          />
          <StatusSelect
            status={status}
            setStatus={setStatus}
            handleChangeStatus={handleStatusChange}
            theme={theme}
          />
        </Stack>
      </Stack>
      <CreateAIAgentModal
        onClose={handleCloseCreateModal}
        open={open}
        theme={theme}
      />
    </>
  );
};

export default Actions;
