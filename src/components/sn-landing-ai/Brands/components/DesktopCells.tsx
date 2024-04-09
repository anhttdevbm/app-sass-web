import { BodyCell } from "components/Table";
import { ExploreData } from "store/content/reducer";
import React, { memo } from "react";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import { ArticleData } from "store/content/reducer";

type DesktopCellsProps = {
  item: ArticleData;
};

const DesktopCells = (props: DesktopCellsProps) => {
  const srcImage = useMemo(() => {  
    if (!props.item.logo) return ""
    
    return props.item.logo?.link as string;
  }, [props.item]);

  return (
    <>
      <BodyCell align="left" noWrap>{props.item.name}</BodyCell>
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
