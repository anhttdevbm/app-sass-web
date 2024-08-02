import { AddCircle, ExpandMore } from "@mui/icons-material";
import { Box, Popover, SxProps } from "@mui/material";
import { Button, Text } from "components/shared";
import { ComponentProps, MouseEventHandler, useState } from "react";

const ButtonWithDropdown = ({
  ...props
}: Omit<ComponentProps<typeof Button>, "children"> & {
  containerSx?: SxProps;
  text: string;
  children: (handleClose: () => void) => JSX.Element;
}) => {
  const { text, children, ...buttonProps } = props;
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
        ...props.containerSx,
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
        {...buttonProps}
      >
        <Text sx={{ color: "white" }}>{text}</Text>
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
        {children(handleClose)}
      </Popover>
    </Box>
  );
};

export default ButtonWithDropdown;
