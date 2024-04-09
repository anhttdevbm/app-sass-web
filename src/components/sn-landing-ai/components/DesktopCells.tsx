import { BodyCell } from "components/Table";
import { ContentData } from "store/content/reducer";
import React, { memo } from "react";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import Stack from "@mui/material/Stack";

type DesktopCellsProps = {
  item: ContentData;
};

const DesktopCells = (props: DesktopCellsProps) => {
  return (
    <>
      <BodyCell align="left" noWrap>{props.item.title}</BodyCell>
      <BodyCell align="left" noWrap>{props.item.description}</BodyCell>
    </>
  );
};
export default memo(DesktopCells);
