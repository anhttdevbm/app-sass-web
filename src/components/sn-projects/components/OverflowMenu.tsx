import { Box, IconButton, Menu, SxProps } from "@mui/material";
import { ReactElement, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const OverflowMenu = (props: { children: ReactElement[] }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <IconButton id="basic-button" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          ["& .MuiPaper-root"]: {
            borderRadius: "1rem",
            width: 200,
            maxWidth: "100%",
          },
        }}
      >
        {props.children.map((el, index) => (
          <div onClick={handleClose} key={el.key + "-overflow-menu-" + index}>
            {el}
          </div>
        ))}
      </Menu>
    </Box>
  );
};

export default OverflowMenu;
