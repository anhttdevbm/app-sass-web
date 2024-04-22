import { Box, BoxProps, useMediaQuery, useTheme } from "@mui/material";
import { ReactNode } from "react";

interface MessageLayoutProps {
  children: ReactNode;
  messageProps?: BoxProps;
}

export const MessageLayout = ({
  children,
  messageProps,
}: MessageLayoutProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { sx, ...props } = messageProps || {};

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        overflowY: "auto",
        marginBottom: "36px",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};
