import React from "react";
import { Box, Stack, Button, IconButton, Avatar } from "@mui/material";
import {
  IosShare,
  AspectRatio,
  Circle,
  AccountCircle,
} from "@mui/icons-material";
import { Text } from "components/shared";
import {
  sxBtn,
  sxBtnCircleActive,
  sxBtnCircleActiveDark,
  sxBtnCircleActiveLight,
  sxPrimaryBtn,
} from "../style";
import AvatarGroup from "components/shared/AvatarGroup";
import useTheme from "hooks/useTheme";
import { useDispatch } from "react-redux";

interface MeetingHeaderLayoutProps {
  sx: object;
  toggleMinimizeMeeting: () => void;
}

const MeetingHeaderLayout: React.FC<MeetingHeaderLayoutProps> = (
  props: MeetingHeaderLayoutProps,
) => {
  const { toggleMinimizeMeeting } = props;
  const { isDarkMode } = useTheme();
  return (
    <Stack direction="row" justifyContent="space-between" sx={{ ...props.sx }}>
      <Box>
        <Text variant="h3">[Internal] Weekly Report Marketing + Sales</Text>
        <Stack
          sx={{ flexDirection: "row", placeItems: "center", gap: 3, mt: 1.5 }}
        >
          <Text variant="body2" color="GrayText">
            31 May 2024
          </Text>
          <Stack sx={{ flexDirection: "row", gap: 1 }}>
            <Circle color="error" />
            <Text variant="body2" color="GrayText">
              26:32
            </Text>
          </Stack>
        </Stack>
      </Box>

      <Stack direction="row" alignItems={"center"}>
        <AvatarGroup avatars={avatar} size={40} sx={{ mr: 2 }} />
        <Box sx={{ mr: 1 }}>
          <Button
            sx={{
              padding: "8px 24px",
              ...sxPrimaryBtn,
              textTransform: "capitalize",
              bgcolor: isDarkMode ? "#3a3b3c" : "#3699FF",
            }}
          >
            <IosShare
              sx={{
                scale: "0.7",
              }}
            />{" "}
            Share Link
          </Button>
        </Box>
        <Box>
          <IconButton
            sx={isDarkMode ? sxBtnCircleActiveDark : sxBtnCircleActiveLight}
            onClick={toggleMinimizeMeeting}
          >
            <AspectRatio />
          </IconButton>
        </Box>
      </Stack>
    </Stack>
  );
};

export default MeetingHeaderLayout;

const avatar = [
  {
    src: "/static/images/avatar/1.jpg",
  },
  {
    src: "/static/images/avatar/1.jpg",
  },
  {
    src: "/static/images/avatar/1.jpg",
  },
  {
    src: "/static/images/avatar/1.jpg",
  },
  {
    src: "/static/images/avatar/1.jpg",
  },
];
