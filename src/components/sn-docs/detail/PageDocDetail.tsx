"use client";

import { Box } from "@mui/material";
import React, { useState } from "react";
import HeaderDocDetail from "./HeaderDocDetail";
import DocDetail from "./DocDetail";
import { NewPageContextProvider } from "../news/context/NewPageContext";
import { ThemeProvider } from "../news/context/ThemeContext";
import FixedLayout from "components/FixedLayout";

const PageDocDetail = () => {
  const [openComment, setOpenComment] = useState(false);
  const [openSlider, setOpenSlider] = useState(false);

  return (
    <ThemeProvider>
      <NewPageContextProvider>
        <Box>
          <HeaderDocDetail
            openComment={openComment}
            setOpenComment={setOpenComment}
            openSlider={openSlider}
            setOpenSlider={setOpenSlider}
          />
          <DocDetail
            openComment={openComment}
            setOpenComment={setOpenComment}
            openSlider={openSlider}
            setOpenSlider={setOpenSlider}
          />
        </Box>
      </NewPageContextProvider>
    </ThemeProvider>
  );
};

export default PageDocDetail;
