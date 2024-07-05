import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useChat } from "store/chat/selectors";
import MediaList from "./MediaList";
import LinkList from "./LinkList";
import FileList from "./FileList";
import { useChatHelpers } from "store/chat/helpers";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: "0 8px" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const List = () => {
  const { onSetTypeList, typeList, roomId } = useChat();
  const { handleGetChatMedias, handleGetChatLinks, handleGetChatFiles } =
    useChatHelpers();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    onSetTypeList(newValue);
    if (newValue === 0) {
      handleGetChatMedias(1);
    } else if (newValue === 1) {
      handleGetChatLinks(1);
    } else if (newValue === 2) {
      handleGetChatFiles(1);
    }
  };

  const styleTab = {
    tab: {
      borderRadius: "1.875rem",
      border: "1px solid",
      fontSize: "0.875rem",
      fontWeight: 400,
      color: "var(--gray-3, #999)",
      margin: "0 5px",
      padding: 0,
      minHeight: "1.75rem",
    },
  };

  return (
    <Box sx={{ width: "100%", marginTop: "10px" }}>
      <Box>
        <Tabs
          value={typeList}
          onChange={handleChange}
          variant="fullWidth"
          aria-label="basic tabs example"
          sx={{
            margin: "0 20px",
            "& .css-sn2yfa-MuiTabs-indicator": {
              display: "none",
            },
          }}
        >
          <Tab label="Media file" {...a11yProps(0)} sx={styleTab?.tab} />
          <Tab label="Link" {...a11yProps(1)} sx={styleTab?.tab} />
          <Tab label="File" {...a11yProps(2)} sx={styleTab?.tab} />
        </Tabs>
      </Box>
      <CustomTabPanel value={typeList} index={0}>
        <MediaList />
      </CustomTabPanel>
      <CustomTabPanel value={typeList} index={1}>
        <LinkList />
      </CustomTabPanel>
      <CustomTabPanel value={typeList} index={2}>
        <FileList />
      </CustomTabPanel>
    </Box>
  );
};

export default List;
