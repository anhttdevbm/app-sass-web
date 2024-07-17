import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { IHandleClickFormat, IToolBarDraftActionItem } from "../..";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import { uuid } from "utils/index";
import { EditorState } from "draft-js";

const borderRightStyle = {
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "25%",
    bottom: "25%",
    right: 0,
    width: "2px",
    backgroundColor: "grey.500",
  },
};

export default function AlignTextDropDown({
  handleChangeAlignFormat,
  editorState,
}: {
  handleChangeAlignFormat: (
    e: SelectChangeEvent,
    typeClick: IHandleClickFormat,
  ) => void;
  editorState: EditorState;
}) {
  const [alignFormat, setAlignFormat] = useState<IToolBarDraftActionItem>();
  const alignFormatList: IToolBarDraftActionItem[] = useMemo(() => [
    {
      id: uuid(),
      label: "Left",
      style: "text-align-left",
      icon: <FormatAlignLeftIcon />,
      method: "block",
    },
    {
      id: uuid(),
      label: "Center",
      style: "text-align-center",
      icon: <FormatAlignCenterIcon />,
      method: "block",
    },
    {
      id: uuid(),
      label: "Right",
      style: "text-align-right",
      icon: <FormatAlignRightIcon />,
      method: "block",
    },
  ],[]);

  const [open, setOpen] = useState(false);

  const handleChange = (event: SelectChangeEvent) => {
    const alignFormatSelected = alignFormatList.find(
      (item) => item.label === event.target.value,
    );
    if (alignFormatSelected) {
      setTimeout(() => {
        handleChangeAlignFormat(event, {
          method: alignFormatSelected.method,
          style: alignFormatSelected.style,
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

  // xác định align hiện tại
  useEffect(() => {
    const currentBlock = editorState
      .getCurrentContent()
      .getBlockForKey(editorState.getSelection().getStartKey());
    
    const blockData = currentBlock.getData();
    const currentAlignment = blockData.get('textAlign') || 'left';
    
    const currentAlignFormat = alignFormatList.find(item => item.style === `text-align-${currentAlignment}`);
    setAlignFormat(currentAlignFormat || alignFormatList[0]);
  }, [editorState, alignFormatList]);

  return (
    <Box
      sx={{
        ...borderRightStyle,
      }}
    >
      <FormControl fullWidth>
        <Select
          sx={{
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
          labelId="dropdown-select-textFormat"
          id="dropdown-select-textFormat"
          value={alignFormat?.label ?? ""}
          defaultValue={alignFormatList[0].label}
          onChange={handleChange}
          open={open}
          onOpen={handleOpen}
          onClose={handleClose}
        >
          {alignFormatList.map((item) => (
            <MenuItem key={item.id} value={item.label}>
              {item.icon}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
