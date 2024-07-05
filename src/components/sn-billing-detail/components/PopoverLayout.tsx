import {
  ForwardedRef,
  forwardRef,
  memo,
  MouseEvent,
  ReactNode,
  useId,
  useState,
} from "react";
import {
  Box,
  BoxProps,
  ButtonBase,
  Popover,
  popoverClasses,
  Stack,
} from "@mui/material";

type PopoverLayoutProps = {
  children: ReactNode;

  label: ReactNode;
  containerProps?: BoxProps;
};

const PopoverLayout = forwardRef(
  (props: PopoverLayoutProps, ref: ForwardedRef<HTMLButtonElement | null>) => {
    const { children, label, containerProps } = props;

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const popoverId = useId();
    const onOpen = (event: MouseEvent<HTMLSpanElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const onClose = () => {
      setAnchorEl(null);
    };

    return (
      <>
        <Box
          onClick={onOpen}
          component="span"
          sx={{ cursor: "pointer", ...containerProps?.sx }}
        >
          {label}
        </Box>
        <ButtonBase onClick={onClose} hidden ref={ref} />
        <Popover
          id={popoverId}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={onClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          sx={{
            [`& .${popoverClasses.paper}`]: {
              backgroundImage: "none",
              minWidth: 216,
              maxWidth: 236,
              maxHeight: 300,
            },
          }}
          slotProps={{
            paper: {
              sx: {
                borderRadius: 1,
                mt: 0.5,
              },
            },
          }}
        >
          <Stack
            sx={{
              boxShadow: "2px 2px 24px rgba(0, 0, 0, 0.1)",
              border: "1px solid",
              borderColor: "grey.100",
              borderBottomLeftRadius: 1,
              borderBottomRightRadius: 1,
            }}
          >
            {children}
          </Stack>
        </Popover>
      </>
    );
  },
);

PopoverLayout.displayName = "PopoverLayout";

export default memo(PopoverLayout);
