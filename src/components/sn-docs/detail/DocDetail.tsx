"use client";

import React, { useEffect, useState } from "react";
import LeftSlideDoc from "./LeftSlide/LeftSlideDoc";
import { Box } from "@mui/material";
import EditDocs from "./EditDocs";
import PageBody from "../news/page-body";
import CommentDialog from "../news/page-body/components/CommentDialog";
import FixedLayout from "components/FixedLayout";
import { IDocItem } from "../KanbanViewDocList";
import { useAppSelector } from "store/hooks";

export interface IMemberDocDetail {
  _id: string;
  created_time: string;
  doc: string;
  user: string;
  perm: string;
}

export interface ICommentDocDetail {
  _id: string;
  created_time: string;
  updated_time: string;
  doc: string;
  created_b: string;
  position: string;
  content: string;
}

export interface IPositionCommentDocDetail {
  _id: string;
  created_time: string;
  updated_time: string;
  doc: string;
  position: string;
  comment: ICommentDocDetail[];
}

export interface IChildDocDetail {
  _id: string;
  id: string;
  name: string;
  created_time: string;
  updated_time: string;
  created_by: string;
  updated_by: string;
  owner: string;
  root_directory: string;
  description: string;
}

export interface IDocItemDetail extends IDocItem {
  member?: IMemberDocDetail[];
  positionComment: IPositionCommentDocDetail[];
  child: IChildDocDetail[];
}

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
  const heightDocDetail = useAppSelector(
    (state) => state.doc.heightHeaderDocDetail,
  );
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box
      position={"relative"}
      sx={{
        overflow: "auto",
        height: `calc(${screenHeight}px - ${heightDocDetail}px)`,
        display: "flex",
        gap: { xs: open ? 3 : 0, md: 3 },
      }}
      px={{ md: 3 }}
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
