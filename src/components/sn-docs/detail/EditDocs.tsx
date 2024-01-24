"use client";
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { COLORS } from "components/Editor";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { Box, Stack } from "@mui/material";
import "react-quill/dist/quill.snow.css";
import "./style.css";
import DrawComment, { LayoutSlider } from "./DrawComment";
import { Text } from "components/shared";
import CloseIcon from "icons/CloseIcon";
import DrawSlider from "./DrawSlider";
import { Editor } from "@tiptap/core";

interface IEditDocs {
  open: boolean;
  openComment: boolean;
  openSlider: boolean;
  setOpenSlider: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenComment: React.Dispatch<React.SetStateAction<boolean>>;
  editor: Editor;
}

const EditDocs = ({
  open,
  openComment,
  setOpenComment,
  openSlider,
  setOpenSlider,
  editor,
}: IEditDocs) => {
  const [title, setTitle] = useState("");
  const [height, setHeight] = useState(0);
  const [heightContent, setHeightContent] = useState(0);
  const [heightToolbar, setHeightToolbar] = useState(69);
  const [content, setContent] = useState("");
  const titleRef: any = useRef(null);
  let tbRef: any = useRef(null);
  const contentRef: any = useRef(null);
  const modules = useMemo(
    () => ({
      toolbar: [
        [
          { header: [1, 2, 3, 4, 5, 6, false] },
          "bold",
          "italic",
          "underline",
          "strike",
          "blockquote",
          "code-block",
          { list: "ordered" },
          { list: "bullet" },
          { align: [] },
          { color: [] },
          { background: ["transparent", ...COLORS] },
          "link",
          "image",
          "video",
          "clean",
        ],
      ],
    }),
    [],
  );

  useEffect(() => {
    if (titleRef.current) {
      const elementHeight = titleRef.current.offsetHeight;
      setHeight(elementHeight);
    }
  }, [titleRef?.current, title]);

  useEffect(() => {
    if (tbRef.current) {
      const elementHeight = tbRef.current.offsetHeight;
      setHeightToolbar(elementHeight);
    }
  }, [tbRef?.current, title]);

  useEffect(() => {
    const tb = document.querySelector(".edit-content .ql-toolbar");
    if (tb) {
      tbRef.current = tb;
    }
  }, []);
  useEffect(() => {
    const tb = document.querySelector(".edit-content .ql-container");
    if (tb) {
      contentRef.current = tb;
    }
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      const elementHeight = contentRef.current.offsetHeight;
      setHeightContent(elementHeight);
    }
  }, [contentRef?.current]);

  return (
    <>
      {openComment && (
        <LayoutSlider
          heightToolbar={heightToolbar}
          heightContent={heightContent}
          height={height}
        >
          <DrawComment editor={editor}></DrawComment>
        </LayoutSlider>
      )}
      {/* {openSlider && (
        <LayoutSlider
          heightToolbar={heightToolbar}
          heightContent={heightContent}
          height={height}
        >
          <DrawSlider
            setOpenSlider={setOpenSlider}
            editor={editor}
          ></DrawSlider>
        </LayoutSlider>
      )} */}

      <Box
        sx={{
          minWidth: {
            sm: "unset",
            xs: !open ? "unset" : "calc(100vh - 39px)",
          },
          paddingBottom: {
            sm: "0",
            xs: "80px",
          },
          width: {
            sm: "70%",
            xs: "100%",
          },
          position: "relative",
          // Title
          ".edit-title .ql-toolbar": {
            display: "none",
          },
          ".edit-title .ql-container": {
            background: "white !important",
            border: "none",
            paddingLeft: {
              sm: "32px",
              xs: "0",
            },
          },
          ".edit-title": {
            position: "absolute",
            width: "100%",
            top: {
              sm: `${heightToolbar + 20}px`,
              xs: "0",
            },
            zIndex: 1,
          },
          ".edit-title .ql-editor::before": {
            paddingLeft: {
              sm: "32px",
              xs: "0",
            },
            fontSize: {
              sm: "32px !important",
              xs: "24px !important",
            },
            fontWeight: 700,
          },
          ".edit-title .ql-editor": {
            fontSize: {
              sm: "32px !important",
              xs: "24px !important",
            },
            fontWeight: 700,
          },

          // content
          ".edit-content .ql-toolbar": {
            border: "none !important",
            borderRadius: "6px !important",
            borderBottom: "1px solid var(--Gray1, #ECECF3) !important",
            boxShadow: "2px 2px 24px 0px rgba(0, 0, 0, 0.10)",
            position: {
              sm: "unset",
              xs: "fixed",
            },
            bottom: {
              sm: "unset",
              xs: "20px",
            },
            left: {
              sm: "unset",
              xs: "16px",
            },
            right: {
              sm: "unset",
              xs: "16px",
            },
            zIndex: {
              sm: "unset",
              xs: 29,
            },
            bgcolor: "white",
          },
          ".edit-content .ql-container": {
            marginTop: {
              sm: `${height + 16}px`,
              xs: `${height}px`,
            },
            background: "white !important",
            minHeight: "60vh",
            border: "none",
            paddingLeft: {
              sm: "32px",
              xs: "0",
            },
          },
          ".edit-content .ql-editor::before": {
            paddingLeft: {
              sm: "32px",
              xs: "0",
            },
          },
        }}
        className="entry-content"
      >
        <div ref={titleRef} className="edit-title">
          <ReactQuill
            theme="snow"
            placeholder="Enter document title..."
            value={title}
            onChange={setTitle}
          />
        </div>
        <ReactQuill
          placeholder="Enter document content..."
          modules={modules}
          className="edit-content"
          theme="snow"
          ref={contentRef}
          value={content}
          onChange={setContent}
        />
      </Box>
    </>
  );
};

export default memo(EditDocs);
