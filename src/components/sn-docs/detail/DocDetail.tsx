"use client";

import React, { useState } from "react";
import LeftSlideDoc from "./LeftSlide/LeftSlideDoc";
import { Box } from "@mui/material";
import EditDocs from "./EditDocs";
import PageBody from "../news/page-body";
import CommentDialog from "../news/page-body/components/CommentDialog";
import FixedLayout from "components/FixedLayout";

export interface IDocDetail {
  openComment: boolean;
  openSlider: boolean;
  setOpenSlider: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenComment: React.Dispatch<React.SetStateAction<boolean>>;
}

const DocDetail = ({
  openComment,
  setOpenComment,
  openSlider,
  setOpenSlider,
}: IDocDetail) => {
  const [open, setOpen] = useState(false);

  return (
    <Box
      position={"relative"}
      sx={{
        overflow: "auto",
        height: "100%",
        display: "flex",
        gap: { xs: open ? 3 : 0, md: 3 },
      }}
      px={{ md: 3 }}
      pt={{ md: 1, lg: 1.5 }}
      pb={{ xs: 1.5, md: 1, lg: 1.5 }}
    >
      <LeftSlideDoc open={open} setOpen={setOpen} />
      <PageBody
        openSlider={openSlider}
        setOpenSlider={setOpenSlider}
        openComment={openComment}
        setOpenComment={setOpenComment}
      />
      <CommentDialog />
    </Box>
  );
};

export default DocDetail;
