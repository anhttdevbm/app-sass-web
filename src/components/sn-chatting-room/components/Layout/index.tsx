import { FC, ReactNode } from "react";
import ChattingRoomMobileLayout from "./ChattingRoomMobileLayout";
import { Box } from "@mui/material";
import useTheme from "hooks/useTheme";

interface ChattingRoomLayoutProps {
  children: ReactNode;
  isMobile?: boolean;
}

const ChattingRoomLayout: FC<ChattingRoomLayoutProps> = ({
  children,
  isMobile,
}) => {
  const { isDarkMode } = useTheme();

  if (isMobile) {
    return <ChattingRoomMobileLayout>{children}</ChattingRoomMobileLayout>;
  }
  return (
    <Box display="flex" alignItems="flex-start" width={"100%"} bgcolor={isDarkMode ? "var(--mui-palette-grey-50)" : "white"}>
      {children}
    </Box>
  );
};

export default ChattingRoomLayout;
