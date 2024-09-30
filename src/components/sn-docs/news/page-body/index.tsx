"use client";

// External libraries
import { Box } from "@mui/material";

// Internal modules
import { IDocDetail } from "components/sn-docs/detail/DocDetail";
import DrawComment, {
  LayoutSlider,
} from "components/sn-docs/detail/DrawComment";
import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { resetDocDetail } from "store/docs/reducer";
import { NewPageContext } from "../context/NewPageContext";
import DraftEditor from "./components/DraftEditor";

const PageBody = ({ openSlider, setOpenSlider }: IDocDetail) => {
  const dispatch = useDispatch();
  const { openComment } = useContext(NewPageContext);
  const [minHeight, setMinHeight] = useState("100vh");

  const editor = null;

  useEffect(() => {
    const updateMinHeight = () => {
      const windowHeight: number = window.innerHeight;
      const elementPosition: DOMRect | undefined = document
        .getElementById("is-edit-text")
        ?.getBoundingClientRect();

      if (elementPosition) {
        const newMinHeight: string =
          windowHeight - (elementPosition.top + 50) + "px"; //
        setMinHeight(newMinHeight);
      }
    };

    window.addEventListener("scroll", updateMinHeight);
    window.addEventListener("resize", updateMinHeight);
    updateMinHeight();

    return () => {
      window.removeEventListener("scroll", updateMinHeight);
      window.removeEventListener("resize", updateMinHeight);
      dispatch(resetDocDetail());
    };
  }, []);

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      {openComment && (
        <LayoutSlider heightToolbar={minHeight}>
          <DrawComment editor={editor} />
        </LayoutSlider>
      )}
      <DraftEditor />
    </Box>
  );
};

interface TextareaProps {
  fontFamily: string;
}

export default PageBody;
