"use client";

import {
  memo,
  forwardRef,
  useEffect,
  useRef,
  useState,
  ForwardedRef,
} from "react";
import { Box, Stack, StackProps, useMediaQuery, useTheme } from "@mui/material";
import useWindowSize from "hooks/useWindowSize";

export type FixedLayoutTaskProps = Omit<StackProps, "onSubmit"> & {
  children: React.ReactNode;
};

interface MyDOMRect {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
}

const FixedLayoutTask = forwardRef(
  (props: FixedLayoutTaskProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { children, ...rest } = props;
    const { breakpoints } = useTheme();
    const is1440Larger = useMediaQuery(breakpoints.up(1441));

    const windowSize = useWindowSize();
    const [height, setHeight] = useState<number | null>(null);

    const getMyBoundingClientRect = (element: HTMLDivElement): MyDOMRect => {
      const rect = element.getBoundingClientRect();
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

    useEffect(() => {
      if (ref && "current" in ref && ref.current) {
        const heightValue =
          window.innerHeight - getMyBoundingClientRect(ref.current)?.top - 5;
        setHeight(heightValue);
      }
    }, [windowSize]);

    return (
      <Stack width="100%" bgcolor={{ md: "background.default" }}>
        <Box
          ref={ref}
          sx={{
            height: `${height}px`,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            paddingBottom: "16px",
          }}
        >
          <Stack
            mx="auto"
            width="100%"
            flex={is1440Larger ? undefined : 1}
            bgcolor={{ md: "background.paper" }}
            {...rest}
          >
            {children}
          </Stack>
        </Box>
      </Stack>
    );
  },
);
FixedLayoutTask.displayName = "FixedLayoutTask";

export default memo(FixedLayoutTask);
