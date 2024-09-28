import { AddCircle, ExpandMore } from "@mui/icons-material";
import { Box, Popover } from "@mui/material";
import { Button, Text } from "components/shared";
import PlusIcon from "icons/PlusIcon";
import { MouseEventHandler, useState } from "react";

const ButtonWithDropdown = ({
  ...props
}: {
  text: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  disabled: boolean;
  children: (handleClose: () => void) => JSX.Element;
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isOpen = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        background: "linear-gradient(90deg, #2af598, #009efd)",
        "&:hover": {
          background: "linear-gradient(90deg, #2af598, #009efd)",
        },
        borderRadius: "2rem",
        overflow: "hidden",
        minWidth: "146px",
        height: "48px",
        marginLeft: "14px",
      }}
    >
      <Button
        startIcon={
          <PlusIcon
            sx={{
              width: "32px",
              height: "32px",
            }}
          />
        }
        variant="contained"
        sx={{
          color: "common.white",
          bgcolor: "transparent",
          fontSize: "16px",
          fontWeight: "Bold",
          cursor: "pointer",
          fontFamily: "unset",
          pl: "20px !important",
          "&:hover": {
            background: "transparent",
          },
        }}
        {...props}
      >
        {props.text}
      </Button>
      <Button
        variant="primary"
        sx={{
          paddingLeft: 0,
          paddingRight: 1,
          borderRadius: "0 2rem 2rem 0",
          borderLeft: "solid 1px white",
          bgcolor: "transparent",
          "&:hover": {
            background: "transparent",
          },
        }}
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <ExpandMore />
      </Button>
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {props.children(handleClose)}
      </Popover>
    </Box>
  );
};

export default ButtonWithDropdown;
