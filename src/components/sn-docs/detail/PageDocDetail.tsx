"use client";

import { Box } from "@mui/material";
import { useState } from "react";
import { NewPageContextProvider } from "../news/context/NewPageContext";
import { ThemeProvider } from "../news/context/ThemeContext";
import DocDetail from "./DocDetail";
import HeaderDocDetail from "./HeaderDocDetail";

const PageDocDetail = () => {
  const [openComment, setOpenComment] = useState(false);
  const [openSlider, setOpenSlider] = useState(false);

  return (
    <ThemeProvider>
      <NewPageContextProvider>
        <Box sx={{ height: "100%" }}>
          <HeaderDocDetail
            openComment={openComment}
            setOpenComment={setOpenComment}
            openSlider={openSlider}
            setOpenSlider={setOpenSlider}
          />
          <DocDetail />
        </Box>
      </NewPageContextProvider>
    </ThemeProvider>
  );
};

export default PageDocDetail;
