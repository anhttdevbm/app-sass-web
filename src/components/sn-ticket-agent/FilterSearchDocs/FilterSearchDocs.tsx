/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SxProps,
} from "@mui/material";
import { NS_COMMON, NS_DOCS } from "constant/index";
import { useTranslations } from "next-intl";
import React, { memo, useState } from "react";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import FilterPosition from "./FilterPosition";
import FilterStatus from "./FilterStatus";


export interface FilterSearchDocsProps {
  queries: Params;
  onChange: (name: string, value: any) => void;
}

const FilterSearchDocs = ({ onChange, queries }: FilterSearchDocsProps) => {

  return (
    <>
      <FilterPosition queries={queries} onChange={onChange}></FilterPosition>
      <FilterStatus queries={queries} onChange={onChange}></FilterStatus>
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
