import { Box, Button, LinearProgress, Stack, Typography } from "@mui/material";
import Avatar from "components/Avatar";
import { inter } from "components/sn-time-tracking/CalendarTracking/CalendarTracking.styles";
import { SettingsOutlineIcon } from "icons/SettingsOutlineIcon";
import { useEffect, useState } from "react";

interface IProps {
  onClickSetting: (e: React.MouseEvent<HTMLElement>) => void;
}

export default function CaptionShow({ onClickSetting }: IProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev < 100) {
          return prev + 10;
        }
        return 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <Stack
      sx={{
        px: "24px",
      }}
    >
      <Stack
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Avatar src="" alt="" size={44} />
          <Box>
            <Typography
              sx={{
                fontSize: "12px",
                lineHeight: "18px",
                fontFamily: inter.style.fontFamily,
                mb: "4px",
              }}
            >
              Lan Hoang
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                lineHeight: "20px",
                fontFamily: inter.style.fontFamily,
                fontWeight: 700,
              }}
            >
              Hello!, How are you?
            </Typography>
          </Box>
        </Box>
        <Box>
          <Button
            sx={{
              minWidth: "120px",
              backgroundColor: "#E1F0FF",
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "#E1F0FF",
                opacity: 0.8,
              },
            }}
            onClick={onClickSetting}
            startIcon={
              <SettingsOutlineIcon
                sx={{
                  fill: "transparent",
                  width: "18px",
                  height: "18px",
                  position: "relative",
                  top: "1px",
                  "& path": {
                    stroke: "#3699FF",
                  },
                }}
              />
            }
          >
            Settings
          </Button>
        </Box>
      </Stack>
      <Box
        sx={{
          width: "50%",
          mx: "auto",
          mt: "28px",
          mb: "20px",
        }}
      >
        <LinearProgress
          sx={{
            borderRadius: "50px",
          }}
          variant="buffer"
          value={timeRemaining}
        />
      </Box>
    </Stack>
  );
}
