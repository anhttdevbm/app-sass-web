import { BodyCell } from "components/Table";
import { ExploreData } from "store/content/reducer";
import React, { memo } from "react";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import { BannerCenterData } from "store/content/reducer";

type DesktopCellsProps = {
  item: BannerCenterData;
};

const DesktopCells = (props: DesktopCellsProps) => {
  const srcImage = useMemo(() => {  
    if (!props.item.banner_image) return ""
    
    return props.item?.banner_image.link as string;
  }, [props.item]);

  return (
    <>
      <BodyCell align="left">
        {props.item?.banner_title}
      </BodyCell>
      <BodyCell align="left" noWrap>
        {props.item?.banner_description}
      </BodyCell>
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
