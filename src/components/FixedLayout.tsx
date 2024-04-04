"use client";

import { memo, forwardRef, useEffect, useRef, useState } from "react";
import { Box, Stack, StackProps, useMediaQuery, useTheme } from "@mui/material";
import useWindowSize from "hooks/useWindowSize";

interface MyDOMRect {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
}

const FixedLayout = (props: { rounded?: string } & StackProps) => {
  const { children, order, rounded = "12px", ...rest } = props;
  const { breakpoints } = useTheme();
  const is1440Larger = useMediaQuery(breakpoints.up(1441));
  const [height, setHeight] = useState(0);
  const windowSize = useWindowSize();

  const ref = useRef();

  const getMyBoundingClientRect = (element: HTMLElement): MyDOMRect => {
    const rect = element.getBoundingClientRect();

    // Chuyển đổi từ DOMRect sang MyDOMRect
    const myRect: MyDOMRect = {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };

    return myRect;
  };

  // const elementRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (ref.current) {
      const top =
        window.innerHeight - getMyBoundingClientRect(ref?.current).top - 5;
      setHeight(top);
    }
  }, [windowSize]);

  return (
    <Stack width="100%" bgcolor={{ md: "background.default" }} order={order}>
      <Box
        ref={ref}
        sx={{
          height: `${height}px`,
          minHeight: 0,
          overflowY: "hidden",
          overflowX: "hidden",
          paddingBottom: "16px",
          borderRadius: rounded,
        }}
      >
        <Stack
          // maxWidth={1349}
          // maxWidth={1349}
          mx="auto"
          width="100%"
          height="100%"
          flex={is1440Larger ? undefined : 1}
          bgcolor={{ md: "background.paper" }}
          {...rest}
        >
          {children}
        </Stack>
      </Box>
    </Stack>
  );
};
FixedLayout.displayName = "FixedLayout";

export default memo(FixedLayout);
