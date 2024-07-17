import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import AddSessionMenuList from "./AddSessionMenuList";
import { DraftBlockType } from "draft-js";

export interface IPropsAddSessionTool {
  handleClickChecked?: (
    type: DraftBlockType,
  ) => (ev: React.MouseEvent<HTMLElement>) => void;
  focusEditor?: () => void;
}
export default function AddSessionTool({
  props,
}: {
  props: IPropsAddSessionTool;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickAddSession = (event: React.MouseEvent<HTMLElement>) => {
    if (props.focusEditor) props.focusEditor();
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        position="relative"
        py={2}
      >
        {/* Thêm đường kẻ ngang */}
        <Box
          position="absolute"
          top="50%"
          left={0}
          right={0}
          height="1px"
          bgcolor="#EFEFEF"
          zIndex={0}
        />
        <Box
          alignItems="center"
          sx={{ backgroundColor: "grey.50" }}
          px={2}
          zIndex={1}
          aria-haspopup="true"
        >
          <Button
            onClick={handleClickAddSession}
            sx={{
              display: "flex",
              cursor: "pointer",
              p: "8px",
              textTransform: "none",
              position: "relative",
            }}
          >
            <Box
              borderRadius="9999px"
              sx={{
                width: "24px",
                height: "24px",
                backgroundImage: "linear-gradient(to right, #2AF598, #009EFD)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              mr={0.5}
            >
              <AddIcon
                sx={{ width: "18px", height: "18px", color: "common.white" }}
              />
            </Box>
            <Typography>Add session</Typography>
          </Button>
          <AddSessionMenuList
            handleClickChecked={props.handleClickChecked}
            focusEditor={props.focusEditor}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
          />
        </Box>
      </Box>
    </>
  );
}
