import {
  Box,
  ButtonBase,
  Grow,
  MenuItem,
  MenuList,
  Popper,
  PopperProps,
  Stack,
  popoverClasses,
} from "@mui/material";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import Text from "./Text";

type Props = {
  anchorEl: any;
  setAnchorEl: (el: any) => void;
  placement?: PopperProps["placement"];
  maxWidth?: string | number;
  autoWidth?: boolean;
};

export const PopperMenu = ({
  anchorEl,
  setAnchorEl,
  maxWidth = 250,
  placement = "bottom-end",
  autoWidth = false,
  children,
}: PropsWithChildren<Props>) => {
  const refClickOutSide = useOnClickOutside(() => setAnchorEl(null));
  const [width, setWidth] = useState<number | string>(0);

  // useEffect(() => {
  //   if (!anchorEl) {
  //     setTimeout(() => {
  //       setWidth(0);
  //     }, 300);
  //   } else {
  //     setWidth(anchorEl.offsetWidth + "px");
  //   }
  // }, [anchorEl]);

  return (
    <Popper
      ref={refClickOutSide}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      sx={{
        [`& .${popoverClasses.paper}`]: {
          backgroundImage: "white",
          minWidth: 150,
          maxWidth,
        },
        zIndex: 1000,
        ...(autoWidth && { width }),
      }}
      transition
      placement={placement}
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps} timeout={350}>
          <Stack
            py={2}
            sx={{
              boxShadow: "2px 2px 24px rgba(0, 0, 0, 0.2)",
              border: "1px solid",
              borderTopWidth: 0,
              borderColor: "grey.100",
              borderRadius: 1,
              bgcolor: "background.paper",
            }}
          >
            <MenuList component={Box} sx={{ py: 0 }}>
              {children}
            </MenuList>
          </Stack>
        </Grow>
      )}
    </Popper>
  );
};

export const PopperItem = ({
  onClick,
  children,
}: PropsWithChildren<{ onClick?: any }>) => {
  return (
    <MenuItem
      onClick={onClick}
      component={ButtonBase}
      sx={{ width: "100%", py: 1, px: 2 }}
    >
      <Text variant="body2" color="grey.400">
        {children}
      </Text>
    </MenuItem>
  );
};
