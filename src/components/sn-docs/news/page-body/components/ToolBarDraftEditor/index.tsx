import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import SuperscriptIcon from '@mui/icons-material/Superscript';
import SubscriptIcon from '@mui/icons-material/Subscript';
import TextRotationNoneIcon from '@mui/icons-material/TextRotationNone';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import CodeOffIcon from '@mui/icons-material/CodeOff';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import { RichUtils } from "draft-js";
import { Box } from '@mui/material';

export default function ToolBarDraftEditor ({ editorState, setEditorState }) {
    const tools = [
        {
          label: "bold",
          style: "BOLD",
          icon: <FormatBoldIcon />,
          method: "inline",
        },
        {
          label: "italic",
          style: "ITALIC",
          icon: <FormatItalicIcon />,
          method: "inline",
        },
        {
          label: "underline",
          style: "UNDERLINE",
          icon: <FormatUnderlinedIcon />,
          method: "inline",
        },
        {
          label: "highlight",
          style: "HIGHLIGHT",
          icon: <AutoFixHighIcon />,
          method: "inline",
        },
        {
          label: "strike-through",
          style: "STRIKETHROUGH",
          icon: <StrikethroughSIcon />,
          method: "inline",
        },
        {
          label: "Superscript",
          style: "SUPERSCRIPT",
          icon: <SuperscriptIcon />,
          method: "inline",
        },
        {
          label: "Subscript",
          style: "SUBSCRIPT",
          icon: <SubscriptIcon />,
          method: "inline",
        },
        {
          label: "Monospace",
          style: "CODE",
          icon: <TextRotationNoneIcon />,
          method: "inline",
        },
        {
          label: "Blockquote",
          style: "blockQuote",
          icon: <FormatQuoteIcon />,
          method: "block",
        },
        {
          label: "Unordered-List",
          style: "unordered-list-item",
          method: "block",
          icon: <FormatListBulletedIcon />,
        },
        {
          label: "Ordered-List",
          style: "ordered-list-item",
          method: "block",
          icon: <FormatListNumberedIcon />,
        },
        {
          label: "Code Block",
          style: "CODEBLOCK",
          icon: <CodeOffIcon />,
          method: "inline",
        },
        {
          label: "Uppercase",
          style: "UPPERCASE",
          icon: <KeyboardArrowUpIcon />,
          method: "inline",
        },
        {
          label: "lowercase",
          style: "LOWERCASE",
          icon: <KeyboardArrowDownIcon />,
          method: "inline",
        },
        {
          label: "Left",
          style: "leftAlign",
          icon: <FormatAlignLeftIcon />,
          method: "block",
        },
        {
          label: "Center",
          style: "centerAlign",
          icon: <FormatAlignCenterIcon />,
          method: "block",
        },
        {
          label: "Right",
          style: "rightAlign",
          icon: <FormatAlignRightIcon />,
          method: "block",
        },
        { label: "H1", style: "header-one", method: "block" },
        { label: "H2", style: "header-two", method: "block" },
        { label: "H3", style: "header-three", method: "block" },
        { label: "H4", style: "header-four", method: "block" },
        { label: "H5", style: "header-five", method: "block" },
        { label: "H6", style: "header-six", method: "block" },
      ];

    const applyStyle = (e, style, method) => {
        e.preventDefault();
        method === "block"
          ? setEditorState(RichUtils.toggleBlockType(editorState, style))
          : setEditorState(RichUtils.toggleInlineStyle(editorState, style));
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
        <Box display="flex" gap={0.5} flexWrap="wrap">
          {tools.map((item, idx) => (
            <button
              style={{
                color: isActive(item.style, item.method)
                  ? "rgba(0, 0, 0, 1)"
                  : "rgba(0, 0, 0, 0.3)",
              }}
              key={`${item.label}-${idx}`}
              title={item.label}
              onClick={(e) => applyStyle(e, item.style, item.method)}
              onMouseDown={(e) => e.preventDefault()}
            >
              {item.icon || item.label}
            </button>
          ))}
        </Box>
      );
}