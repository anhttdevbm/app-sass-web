"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { SvgIcon as MuiSvgIcon, SvgIconProps } from "@mui/material";

const SvgIcon = (props: SvgIconProps) => {
  const { sx = {}, ...rest } = props;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { transform, ...restSx } = sx as any;

  const [zoom, setZoom] = useState<number | undefined>();

  const onResize = useCallback(() => {
    const _zoom =
      Math.ceil(((window.outerWidth - 10) / window.innerWidth) * 100) / 100;

    setZoom(_zoom > 1 ? 1 : _zoom);
  }, []);

  useEffect(() => {
    onResize();

    window.addEventListener("resize", () => {
      onResize();
    });
  }, [onResize]);

  return (
    <MuiSvgIcon
      sx={{ transform: `scale(${zoom}) ${transform ?? ""}`, ...restSx }}
      {...rest}
    />
  );
};

export default memo(SvgIcon);
