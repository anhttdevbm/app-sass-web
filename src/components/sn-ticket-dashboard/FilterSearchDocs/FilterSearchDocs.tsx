/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SxProps
} from "@mui/material";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { memo, useState } from "react";
import FilterTime from "./FilterTime";


export interface FilterSearchDocsProps {
  queries: Params;
  onChange: (name: string, value: any) => void;

}

const FilterSearchDocs = ({ onChange, queries  }: FilterSearchDocsProps) => {

  return (
    <>
      {/* TODO: build error */}
      <FilterTime queries={queries}  onChange={onChange} /> 
      {/* <FilterPeople  queries={queries} onChange={onChange}></FilterPeople> */}

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
