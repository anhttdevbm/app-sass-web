import { BodyCell } from "components/Table";
import { ExploreData } from "store/content/reducer";
import React, { memo } from "react";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import {Stack, Link} from "@mui/material";
import { ContentData } from "store/content/reducer";
import LinkIcon from "icons/LinkIcon"

type DesktopCellsProps = {
  item: ContentData;
};

const DesktopCells = (props: DesktopCellsProps) => {
  const srcImage = useMemo(() => {  
    if (!props.item.image) return ""
    
    return props.item?.image.link as string;
  }, [props.item.image]);

  return (
    <>
      <BodyCell align="left" noWrap>
        {props.item?.title}
      </BodyCell>
      <BodyCell align="left" noWrap>
        {props.item?.description}
      </BodyCell>
      <BodyCell align="center" noWrap>
        <Link
          href={props.item.linkCTA}
          sx={{
            textDecoration: "none",
            display: "flex",
            justifyContent: "center"
          }}
          target="_blank"
        >
          <LinkIcon sx={{ color: "#1BC5BD", mr: 1 }} />
        </Link>
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
