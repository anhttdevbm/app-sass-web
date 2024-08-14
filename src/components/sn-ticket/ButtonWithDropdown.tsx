import { AddCircle, ExpandMore } from "@mui/icons-material";
import { Box, Popover } from "@mui/material";
import { Button, Text } from "components/shared";
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
        background:
          "linear-gradient(90deg, rgba(41,242,155,1) 0%, rgba(1,160,250,1) 100%)",
        borderRadius: "2rem",
      }}
    >
      <Button
        startIcon={<AddCircle />}
        variant="primary"
        size="small"
        sx={{
          borderRadius: "2rem 0 0 2rem",
          bgcolor: "transparent",
        }}
        {...props}
      >
        <Text sx={{ color: "white" }}>{props.text}</Text>
      </Button>
      <Button
        variant="primary"
        sx={{
          paddingLeft: 0,
          paddingRight: 1,
          borderRadius: "0 2rem 2rem 0",
          borderLeft: "solid 1px white",
          bgcolor: "transparent",
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
