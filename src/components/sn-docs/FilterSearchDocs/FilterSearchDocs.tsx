/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, MenuList, Popover, Stack, popoverClasses } from "@mui/material";
import { Text } from "components/shared";
import { NS_COMMON, NS_DOCS } from "constant/index";
import ChevronIcon from "icons/ChevronIcon";
import { useTranslations } from "next-intl";
import React, { memo, useState } from "react";
import FilterMember from "./FilterMember";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import FilterMemberEdit from "./FilterMemberEdit";
import FilterMemberProject from "./FilterMemberProject";
import FilterProjectStatus from "./FilterProjectStatus";

export interface FilterSearchDocsProps {
  queries: Params;
  onChange: (name: string, value: any) => void;
}

const FilterSearchDocs = ({ onChange, queries }: FilterSearchDocsProps) => {
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
      <FilterMember queries={queries} onChange={onChange}></FilterMember>
      <FilterMemberEdit
        queries={queries}
        onChange={onChange}
      ></FilterMemberEdit>
      {/* <FilterName queries={queries} onChange={onChange}></FilterName> */}
      <FilterMemberProject
        queries={queries}
        onChange={onChange}
      ></FilterMemberProject>
      {/* <FilterProjectStatus
        queries={queries}
        onChange={onChange}
      ></FilterProjectStatus> */}
    </>
  );
};

export default memo(FilterSearchDocs);

export const sxConfig = {
  item: {
    width: "100%",
    py: 1,
    px: 1, 
    margin: "8px 0",
    marginLeft: "auto", 
  },
};
