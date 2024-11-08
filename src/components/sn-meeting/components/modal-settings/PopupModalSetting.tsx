import {
  Box,
  Button,
  Divider,
  IconButton,
  Popper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import CloseIcon from "icons/CloseIcon";
import { MonitorMobileIcon } from "icons/MonitorMobileIcon";
import { SubTitleIcon } from "icons/SubTitleIcon";
import { useState } from "react";
import CaptionTabPanel from "./CaptionTabPanel";
import DeviceTabPanel from "./DeviceTabPanel";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

interface IProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

export default function PopupModalSetting({ anchorEl, onClose }: IProps) {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  return (
    <Popper
      id={id}
      open={open}
      anchorEl={anchorEl}
      sx={{
        position: "fixed !important",
        inset: "0 !important",
        display: "flex",
        justifyContent: "center",
        transform: "none !important",
        paddingTop: "40px",
        zIndex: 10,
      }}
    >
      <Stack
        sx={{
          background: "#fff",
          minWidth: "800px",
          height: "fit-content",
          boxShadow: "2px 2px 24px 0px #0000001A",
          borderRadius: "4px",
          border: "1px solid #ECECF3",
        }}
      >
        <Box
          sx={{
            height: "72px",
            px: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontWeight: "600",
            }}
          >
            Caption Setting
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box
          sx={{
            flexGrow: 1,
            bgcolor: "background.paper",
            display: "flex",
          }}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{
              alignItems: "start",
            }}
          >
            <Tab
              sx={{
                color: "#212121",
                "&.Mui-selected": {
                  color: "#5C98F6 !important",
                  backgroundColor: "#E1F0FF !important",
                },
              }}
              label={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    minWidth: "160px",
                  }}
                >
                  <MonitorMobileIcon />
                  <Typography
                    sx={{
                      color: "inherit",
                    }}
                  >
                    Device
                  </Typography>
                </Box>
              }
              {...a11yProps(0)}
            />
            <Tab
              sx={{
                color: "#212121",
                "&.Mui-selected": {
                  color: "#5C98F6 !important",
                  backgroundColor: "#E1F0FF !important",
                },
              }}
              label={
                <Box
                  sx={{
                    display: "flex",
                    minWidth: "160px",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <SubTitleIcon />
                  <Typography
                    sx={{
                      color: "inherit",
                    }}
                  >
                    Caption
                  </Typography>
                </Box>
              }
              {...a11yProps(1)}
            />
          </Tabs>
          <DeviceTabPanel value={value} index={0} />
          <CaptionTabPanel value={value} index={1} />
        </Box>
      </Stack>
    </Popper>
  );
}
