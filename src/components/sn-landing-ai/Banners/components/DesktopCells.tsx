import { BodyCell } from "components/Table";
import { ExploreData } from "store/content/reducer";
import React, { memo } from "react";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import { ContentData } from "store/content/reducer";

type DesktopCellsProps = {
  item: ContentData;
};

const DesktopCells = (props: DesktopCellsProps) => {
  const srcImage = useMemo(() => {  
    if (!props.item.image) return ""
    
    return props.item?.image.link as string;
  }, [props.item.image]);

  const srcImage2 = useMemo(() => {  
    if (!props.item.image2) return ""
    
    return props.item?.image2.link as string;
  }, [props.item.image2]);

  return (
    <>
      <BodyCell align="left" noWrap>
        {props.item?.title}
      </BodyCell>
      <BodyCell align="left" noWrap>
        {props.item?.description}
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
      <BodyCell align="center">
        <Stack
          justifyContent="center"
          alignItems="center"
          height={70}
        >
          <Image
            src={srcImage2}
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
