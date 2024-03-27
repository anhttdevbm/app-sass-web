"use client";

import React, { useMemo } from "react";
import { Text, TextProps } from "components/shared";
import { formatNumber } from "utils/index";

const Content = (props: TextProps) => {
  const { children = "--", sx, onClick, ...rest } = props;

  const additionalSx = useMemo(() => (onClick ? sxLink : {}), [onClick]);

  return (
    <Text
      px={2}
      onClick={onClick}
      variant="body2"
      color="grey.400"
      textAlign={{ md: "center" }}
      overflow="hidden"
      sx={{ ...additionalSx, ...sx }}
      width="100%"
      noWrap
      {...rest}
    >
      {typeof children === "number" ? formatNumber(children) : children}
    </Text>
  );
};

export default Content;

const sxLink = {
  cursor: "pointer",
  color: "text.primary",
  "&:hover": {
    color: "primary.main",
  },
};
