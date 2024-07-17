import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { IHandleClickFormat, IToolBarDraftActionItem } from "../..";
import { uuid } from "utils/index";
import { EditorState } from "draft-js";

const borderXStyle = {
  position: "relative",
  "&::before, &::after": {
    content: '""',
    position: "absolute",
    width: "2px",
    backgroundColor: "grey.500",
    top: "25%",
    bottom: "25%",
  },
  "&::before": {
    left: 0,
  },
  "&::after": {
    right: 0,
  },
};

export default function TextFormatDropDown({
  handleChangeFormatText,
  editorState,
}: {
  handleChangeFormatText: (
    e: SelectChangeEvent,
    typeClick: IHandleClickFormat,
  ) => void;
  editorState: EditorState;
}) {
  const [textFormat, setTextFormat] = useState<IToolBarDraftActionItem>();
  const textFormarts = useMemo<IToolBarDraftActionItem[]>(() => [
    { id: uuid(), label: "Normal Text", style: "normaltext", method: "block" },
    { id: uuid(), label: "H1", style: "header-one", method: "block" },
    { id: uuid(), label: "H2", style: "header-two", method: "block" },
    { id: uuid(), label: "H3", style: "header-three", method: "block" },
    { id: uuid(), label: "H4", style: "header-four", method: "block" },
    { id: uuid(), label: "H5", style: "header-five", method: "block" },
    { id: uuid(), label: "H6", style: "header-six", method: "block" },
  ], []);
  
  const [open, setOpen] = useState(false);

  const handleChange = (event: SelectChangeEvent) => {
    const textFormatSelected = textFormarts.find(
      (item) => item.label === event.target.value,
    );
    if (textFormatSelected) {
      setTimeout(() => {
        handleChangeFormatText(event, {
          method: textFormatSelected.method,
          style: textFormatSelected.style,
        });
      }, 0);
    }
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // check current block đang được bôi đen có style như thế nào
  useEffect(() => {
    const currentBlockType = editorState
      .getCurrentContent()
      .getBlockForKey(editorState.getSelection().getStartKey())
      .getType();

    const currentFormat = textFormarts.find(item => item.style === currentBlockType);
    setTextFormat(currentFormat || textFormarts[0]);
  }, [editorState, textFormarts]);

  return (
    <Box
      sx={{
        ...borderXStyle,
        minWidth: 150,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <FormControl sx={{ height: "100%" }} fullWidth>
        <Select
          sx={{
            height: "100%",
            fontWeight: "bold",
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
          labelId="dropdown-select-textFormat"
          id="dropdown-select-textFormat"
          value={textFormat?.label || ""}
          defaultValue={textFormarts[0].label}
          onChange={handleChange}
          open={open}
          onOpen={handleOpen}
          onClose={handleClose}
        >
          {textFormarts.map((item) => (
            <MenuItem key={item.id} value={item.label}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
