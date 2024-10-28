import { Box, Button, Stack } from "@mui/material";
import { inter } from "components/sn-time-tracking/CalendarTracking/CalendarTracking.styles";
import useBreakpoint from "hooks/useBreakpoint";
import useTheme from "hooks/useTheme";
import { AddUserIcon } from "icons/AddUserIcon";
import { useState } from "react";
import { useSidebar } from "store/app/selectors";
import { store } from "store/configureStore";
import { sxBtn, sxPrimaryBtn } from "../../style";
import Conversation from "./Conversation";
import ListUser from "./ListUser";
import AddParticipantModal from "components/sn-meeting/components/AddParticipantModal";

const RightSidebar = () => {
  const { isDarkMode } = useTheme();
  const { isExpandedSidebar } = useSidebar();
  const { isXlSmaller } = useBreakpoint();
  const [isActive, setIsActive] = useState<boolean>(true);
  const [typeShow, setTypeShow] = useState<"message" | "participants">(
    "participants",
  );
  const [openAddParticipant, setOpenAddParticipant] = useState(false);
  const { remoteStreams } = store.getState().meeting;

  const toggleIsActive = () => {
    setIsActive(!isActive);
  };

  const handleCloseAddParticipant = () => {
    setOpenAddParticipant(false);
  };

  const toggleTypeShow = () => {
    setTypeShow(typeShow === "message" ? "participants" : "message");
  };

  return (
    <Stack
      direction={"column"}
      sx={{
        width: 360,
        backgroundColor: isDarkMode ? "var(--mui-palette-grey-50)" : "#F5F5FD",
        height: "100%",
      }}
    >
      <AddParticipantModal
        open={openAddParticipant}
        handleClose={handleCloseAddParticipant}
      />
      <Box
        textAlign={"center"}
        py={2}
        sx={{
          paddingX: "16px",
        }}
        bgcolor={isDarkMode ? "#000" : "#fff"}
      >
        <Button
          sx={{
            minWidth: "120px",
            backgroundColor: "#E1F0FF",
            width: isExpandedSidebar || isXlSmaller ? "100%" : "240px",
            borderRadius: isExpandedSidebar || isXlSmaller ? "4px" : "40px",
            textTransform: "capitalize",
            "&:hover": {
              backgroundColor: "#E1F0FF",
              opacity: 0.8,
            },
          }}
          onClick={() => setOpenAddParticipant(true)}
          startIcon={
            <AddUserIcon
              sx={{
                fill: "transparent",
                width: "18px",
                height: "18px",
                position: "relative",
                top: "1px",
              }}
            />
          }
        >
          {isExpandedSidebar || isXlSmaller ? "Participant" : "Add Participant"}
        </Button>
      </Box>
      <Stack
        direction={"row"}
        justifyContent={"center"}
        py={2}
        borderBottom={1}
        borderColor={isDarkMode ? "#000" : "#ECECF3"}
      >
        <Box
          sx={{
            bgcolor: isDarkMode ? "#3a3b3c" : "transparent",
            borderRadius: 1,
            padding: "0 16px",
            width: "100%",
          }}
        >
          <Button
            onClick={toggleTypeShow}
            sx={
              typeShow === "message"
                ? activeButton
                : [unActiveButton, { bgcolor: isDarkMode ? "#3a3b3c" : "#fff" }]
            }
          >
            Messages
          </Button>
          <Button
            onClick={toggleTypeShow}
            sx={
              typeShow === "participants"
                ? activeButton
                : [unActiveButton, { bgcolor: isDarkMode ? "#3a3b3c" : "#fff" }]
            }
          >
            Participants
            <span
              style={typeShow === "participants" ? activeBadge : inActiveBadge}
            >
              {remoteStreams.length + 1 || 1}
            </span>
          </Button>
        </Box>
      </Stack>
      {typeShow === "message" && <Conversation />}
      {typeShow === "participants" && <ListUser />}
    </Stack>
  );
};

export default RightSidebar;

const activeButton = {
  ...sxPrimaryBtn,
  width: "50%",
  borderRadius: "6px",
  padding: "8px 16px",
  gap: 1,
  textTransform: "capitalize",
  fontWeight: "600",
};

const unActiveButton = {
  ...sxBtn,
  width: "50%",
  borderRadius: "6px",
  padding: "8px 16px",
  gap: 1,
  textTransform: "capitalize",
  color: "#667085",
  fontWeight: "600",
};

const activeBadge = {
  borderRadius: "16px",
  background: "#fff",
  color: "#000",
  padding: "0 8px",
  fontWeight: "600",
  fontFamily: inter.style.fontFamily,
};

const inActiveBadge = {
  borderRadius: "16px",
  background: "#EEF2F6",
  color: "#697586",
  padding: "0 8px",
  fontWeight: "600",
  fontFamily: inter.style.fontFamily,
};
