import { EditorState, Modifier, RichUtils } from "draft-js";
import { Box, SelectChangeEvent } from "@mui/material";
import { Map } from "immutable";

import React, {
  Dispatch,
  ReactHTML,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import TextFormatDropDown from "./components/TextFormatDropDown";
import BoldItalicUnderlineTextFormat from "./components/BoldItalicUnderTextFormat";
import AlignTextDropDown from "./components/AlignTextDropDown";
import ColorFormatText from "./components/ColorFormatText";
import ListFormatText from "./components/ListFormatText";
import UndoRedoText from "./components/UndoRedoText";
import OtherToolBar from "./components/OtherToolBar";

export interface IToolBarDraftActionItem {
  id?: string;
  label: string;
  style: string;
  method: string;
  icon?: ReactNode;
}

export interface IHandleClickFormat {
  method: string;
  style: string;
}

export default function ToolBarDraftEditor({
  editorState,
  setEditorState,
  setHeightToolBar,
}: {
  editorState: EditorState;
  setEditorState: Dispatch<SetStateAction<EditorState>>;
  setHeightToolBar: Dispatch<SetStateAction<number>>;
}) {
  const refToolBar = useRef<HTMLDivElement | null>(null);

  const applyStyle = (
    e: React.MouseEvent<HTMLButtonElement> | SelectChangeEvent,
    typeClick: IHandleClickFormat,
  ) => {
    if ("currentTarget" in e) {
      e.preventDefault();
    }

    if (typeClick.style.startsWith("text-align-")) {
      // Xử lý căn lề
      const alignment = typeClick.style.replace("text-align-", "");
      const newContentState = Modifier.setBlockData(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        Map({ textAlign: alignment }),
      );
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "change-block-data",
      );
      setEditorState(newEditorState);
    } else if (typeClick.method === "block") {
      // Xử lý các kiểu block khác (như H1, H2, ...)
      setEditorState(RichUtils.toggleBlockType(editorState, typeClick.style));
    } else if (typeClick.style === "color") {
      // Xử lý thay đổi màu chữ
      const selection = editorState.getSelection();
      const color = (e as SelectChangeEvent).target.value; // Lấy giá trị màu từ e.target.value
      const contentState = editorState.getCurrentContent();
      const nextContentState = Modifier.applyInlineStyle(
        contentState,
        selection,
        `color-${color.replace("#", "")}`,
      );
      const newEditorState = EditorState.push(
        editorState,
        nextContentState,
        "change-inline-style",
      );
      setEditorState(newEditorState);
    } else {
      // Xử lý các kiểu inline
      setEditorState(RichUtils.toggleInlineStyle(editorState, typeClick.style));
    }
  };

  // style active khi được chọn
  const isActive = ({ style, method }: { style: string; method: string }) => {
    if (method === "block") {
      const selection = editorState.getSelection();
      const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();
      return blockType === style;
    } else {
      const currentStyle = editorState.getCurrentInlineStyle();
      return currentStyle.has(style);
    }
  };

  useEffect(() => {
    if (refToolBar.current) {
      setHeightToolBar(refToolBar.current.offsetHeight);
    }
  }, []);

  return (
    <Box
      display="flex"
      width="100%"
      gap={0.5}
      overflow="auto"
      flexWrap={{ sm: "wrap", xs: "nowrap" }}
      bgcolor="#EFEFEF"
      paddingY={0.5}
      paddingX={1}
      ref={refToolBar}
      position="absolute"
      top={0}
      zIndex={1}
    >
      <UndoRedoText />
      <TextFormatDropDown
        handleChangeFormatText={applyStyle}
        editorState={editorState}
      />
      <BoldItalicUnderlineTextFormat handleClickFormatBIU={applyStyle} />
      <AlignTextDropDown
        handleChangeAlignFormat={applyStyle}
        editorState={editorState}
      />
      <ColorFormatText handleChangeColor={applyStyle} />
      <ListFormatText handleClickListFormat={applyStyle} />
      <OtherToolBar />

      {/* {tools.map((item, idx) => (
        <button
          style={{
            color: "#222222",
          }}
          key={`${item.label}-${idx}`}
          title={item.label}
          onClick={(e) => applyStyle(e, item.style, item.method)}
          onMouseDown={(e) => e.preventDefault()}
        >
          {item.icon || item.label}
        </button>
      ))} */}
    </Box>
  );
}
