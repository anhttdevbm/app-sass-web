import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

import SuperscriptIcon from "@mui/icons-material/Superscript";
import SubscriptIcon from "@mui/icons-material/Subscript";
import TextRotationNoneIcon from "@mui/icons-material/TextRotationNone";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import CodeOffIcon from "@mui/icons-material/CodeOff";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import { EditorState, RichUtils } from "draft-js";
import { Box } from "@mui/material";
import React, {
  Dispatch,
  ReactHTML,
  ReactNode,
  SetStateAction,
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
}: {
  editorState: EditorState;
  setEditorState: Dispatch<SetStateAction<EditorState>>;
}) {
  const applyStyle = (
    e: React.MouseEvent<HTMLButtonElement>,
    typeClick: IHandleClickFormat,
  ) => {
    e.preventDefault();
    typeClick.method === "block"
      ? setEditorState(RichUtils.toggleBlockType(editorState, typeClick.style))
      : setEditorState(
          RichUtils.toggleInlineStyle(editorState, typeClick.style),
        );
  };

  const isActive = (style, method) => {
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

  return (
    <Box
      display="flex"
      gap={0.5}
      overflow="auto"
      bgcolor="#EFEFEF"
      paddingY={0.5}
      paddingX={1}
    >
      <UndoRedoText />
      <TextFormatDropDown />
      <BoldItalicUnderlineTextFormat handleClickFormatBIU={applyStyle} />
      <AlignTextDropDown />
      <ColorFormatText />
      <ListFormatText />
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
