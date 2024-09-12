/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  MenuList,
  Popover,
  Stack,
  SxProps,
  popoverClasses,
} from "@mui/material";
import { Text } from "components/shared";
import { NS_COMMON, NS_DOCS } from "constant/index";
import ChevronIcon from "icons/ChevronIcon";
import { useTranslations } from "next-intl";
import React, { memo, useState } from "react";
import FilterAssign from "./FilterAssign";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import FilterTime from "./FilterTime";
import FillterPriority from "./FillterPriority";
import FillterTypeTicket from "./FillterTypeTicket";


export interface FilterSearchDocsProps {
  queries: Params;
  onChange: (name: string, value: any) => void;

}

const FilterSearchDocs = ({ onChange, queries  }: FilterSearchDocsProps) => {
  const docsT = useTranslations(NS_DOCS);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const commonT = useTranslations(NS_COMMON);

  const isHasValue =
    queries?.user_id ||
    queries?.project ||
    queries?.lastEdit ||
    queries?.project_status;

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <FillterPriority  queries={queries} onChange={onChange}></FillterPriority>
      <FilterAssign queries={queries} onChange={onChange}></FilterAssign>
      <FillterTypeTicket queries={queries} onChange={onChange}></FillterTypeTicket>
      <FilterTime
        queries={queries}
        onChange={onChange}
      ></FilterTime>
    </>
  );
};

export default memo(FilterSearchDocs);

export const sxConfig: Record<string, SxProps> = {
  item: {
    width: "100%",
    py: 1,
    pr: 1,
    pl: 2,
    gap: 1,
    margin: "8px 0",
    marginLeft: "auto",
    border: "solid 1px lightgrey",
    borderRadius: "2rem",
    bgcolor: "white",
  },
};
