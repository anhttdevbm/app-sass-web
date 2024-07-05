import { BodyCell } from "components/Table";
import { UnlockValueData } from "store/content/reducer";
import React, { memo } from "react";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import {NS_CONTENTS } from "constant/index";
import { useTranslations } from "next-intl";

type DesktopCellsProps = {
  item: UnlockValueData;
};

const DesktopCells = (props: DesktopCellsProps) => {
  const contentT = useTranslations(NS_CONTENTS);

  return (
    <>
      <BodyCell align="left" noWrap>{props.item.name}</BodyCell>
      <BodyCell align="left" noWrap>{props.item.description}</BodyCell>
      <BodyCell align="left" noWrap>{props.item.monthly}</BodyCell>
      <BodyCell align="left" noWrap>{props.item.yearly}</BodyCell>
      <BodyCell align="left" noWrap>{props.item.tag}</BodyCell>
      <BodyCell align="left" noWrap>{props.item.features.join(", ")}</BodyCell>
    </>
  );
};
export default memo(DesktopCells);
