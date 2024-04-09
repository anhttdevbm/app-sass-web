import { BodyCell } from "components/Table";
import { PromoteData } from "store/content/reducer";
import React, { memo } from "react";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import {NS_CONTENTS } from "constant/index";
import { useTranslations } from "next-intl";

type DesktopCellsProps = {
  item: PromoteData;
};

const DesktopCells = (props: DesktopCellsProps) => {
  const contentT = useTranslations(NS_CONTENTS);

  const srcImage = useMemo(() => {  
    if (!props.item.image) return ""
    
    return props.item.image?.link as string;
  }, [props.item]);

  return (
    <>
      <BodyCell align="left" noWrap></BodyCell>
      <BodyCell align="center">
        <Stack
          justifyContent="center"
          alignItems="center"
          height={70}
        >
          <Image
            src={srcImage}
            width={50}
            height={50}
            alt="Image"
            style={{ objectFit: "cover" }}
          />
        </Stack>
      </BodyCell>
    </>
  );
};
export default memo(DesktopCells);
