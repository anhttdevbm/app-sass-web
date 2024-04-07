import { BodyCell } from "components/Table";
import { ExploreData } from "store/content/reducer";
import React, { memo } from "react";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import { BannerFormAboutUs } from "store/content/selectors";

type DesktopCellsProps = {
  item: BannerFormAboutUs;
};

const DesktopCells = (props: DesktopCellsProps) => {
  const srcImage = useMemo(() => {  
    if (!props.item.link) return ""
    
    return props.item?.link as string;
  }, [props.item]);

  return (
    <>
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
