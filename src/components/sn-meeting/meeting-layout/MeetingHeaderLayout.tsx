import { AspectRatio, Circle, IosShare } from "@mui/icons-material";
import { Box, Button, IconButton, Stack } from "@mui/material";
import { Text } from "components/shared";
import AvatarGroup from "components/shared/AvatarGroup";
import useTheme from "hooks/useTheme";
import { useSidebar } from "store/app/selectors";
import {
  sxBtnCircleActiveDark,
  sxBtnCircleActiveLight,
  sxPrimaryBtn,
} from "../style";
import useBreakpoint from "hooks/useBreakpoint";
import { MeetingShareLinkIcon } from "icons/MeetingShareLinkIcon";
import { MaximizeIcon } from "icons/MaximizeIcon";
import { store } from "store/configureStore";
import { useMemo } from "react";

interface MeetingHeaderLayoutProps {
  sx: object;
  toggleMinimizeMeeting: () => void;
  isRecording: boolean;
}

const MeetingHeaderLayout = (props: MeetingHeaderLayoutProps) => {
  const { toggleMinimizeMeeting, isRecording } = props;
  const { isExpandedSidebar } = useSidebar();
  const { isDarkMode } = useTheme();
  const { isXlSmaller } = useBreakpoint();
  const { remoteStreams } = store.getState().meeting;
  const avatars = useMemo(() => {
    return remoteStreams.map((remoteStream) => ({
      src: remoteStream.participant.avatar,
    }));
  }, []);
  return (
    <Stack
      direction={isExpandedSidebar || isXlSmaller ? "column" : "row"}
      justifyContent="space-between"
      sx={{ ...props.sx }}
    >
      <Box>
        <Text
          variant="h3"
          sx={{
            paddingTop: "16px",
            color: "#373131",
          }}
        >
          [Internal] Weekly Report Marketing + Sales
        </Text>
        <Stack
          sx={{
            flexDirection: "row",
            placeItems: "center",
            gap: 3,
            mt: "8px",
            mb: "24px",
          }}
        >
          <Text variant="body2" color="#818A98">
            31 May 2024
          </Text>
          {isRecording && (
            <Stack sx={{ flexDirection: "row", gap: 1 }}>
              <Circle color="error" />
              <Text variant="body2" color="GrayText">
                26:32
              </Text>
            </Stack>
          )}
        </Stack>
      </Box>

      <Stack direction="row" alignItems={"center"}>
        <AvatarGroup
          avatars={avatars}
          size={30}
          sx={{
            mr: 2,
            "& > div": {
              fontSize: "16px",
            },
          }}
        />
        <Box sx={{ mr: 1 }}>
          <Button
            sx={{
              padding: "8px 24px",
              ...sxPrimaryBtn,
              textTransform: "capitalize",
              bgcolor: isDarkMode ? "#3a3b3c" : "#3699FF",
              borderRadius: isExpandedSidebar || isXlSmaller ? "4px" : "44px",
              display: "flex",
              gap: "6px",
              alignItems: "center",
            }}
          >
            <MeetingShareLinkIcon
              sx={{
                width: "16px",
                height: "16px",
                fill: "transparent",
                "& path": {
                  stroke: "#FFF",
                },
              }}
            />
            Share Link
          </Button>
        </Box>
        <Box>
          <IconButton
            sx={
              isDarkMode
                ? sxBtnCircleActiveDark
                : {
                    ...sxBtnCircleActiveLight,
                    bgcolor: "#3699FF",
                    borderRadius: "4px",
                    "&:hover": {
                      opacity: 0.8,
                      bgcolor: "#3699FF",
                    },
                  }
            }
            onClick={toggleMinimizeMeeting}
          >
            <Box
              sx={{
                width: "24px",
                height: "24px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "6px",
                background: "#FFF",
              }}
            >
              <MaximizeIcon
                sx={{
                  width: "20px",
                  height: "20px",
                  fill: "transparent",
                  "& path": {
                    stroke: "#3699FF",
                  },
                }}
              />
            </Box>
          </IconButton>
        </Box>
      </Stack>
    </Stack>
  );
};

export default MeetingHeaderLayout;
