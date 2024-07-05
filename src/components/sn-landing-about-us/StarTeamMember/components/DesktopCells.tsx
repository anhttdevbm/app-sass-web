import { BodyCell } from "components/Table";
import { ExploreData } from "store/content/reducer";
import React, { memo } from "react";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import { StartMemberData } from "store/content/reducer";

type DesktopCellsProps = {
  item: StartMemberData;
};

const DesktopCells = (props: DesktopCellsProps) => {

  return (
    <>
      <BodyCell align="left" noWrap>{props.item.name}</BodyCell>
      <BodyCell align="center" noWrap>{props.item.work_experience}</BodyCell>
      <BodyCell align="center" noWrap>{props.item.college}</BodyCell>
      <BodyCell align="center" noWrap>{props.item.email}</BodyCell>
    </>
  );
};
export default memo(DesktopCells);
