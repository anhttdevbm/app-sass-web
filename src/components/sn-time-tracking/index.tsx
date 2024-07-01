/* eslint-disable no-console */
"use client";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { TabPanel } from "@mui/lab";
import TabContext from "@mui/lab/TabContext";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography
} from "@mui/material";
import { NS_TIME_TRACKING } from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";
import useTheme from "hooks/useTheme";
import { useTranslations } from "next-intl";
import { FC, useState } from "react";
import PlusIcon from "../../icons/PlusIcon";
import {
  CompanyTimeTrackingCalendar,
  MyTimeTrackingCalendar,
  TimelogTrackingCalendar,
} from "./CalendarTracking";

interface ITab {
  label: string;
  value: string;
}

const TimeTrackingPage: FC = () => {
  const { isDarkMode } = useTheme();
  const { isSmSmaller } = useBreakpoint();
  const [tab, setTab] = useState<string>("myTime");
  const [workBgColor, setWorkBgColor] = useState<string>("#FFFFFF");
  const [timeBgColor, setTimeBgColor] = useState<string>("#D9F0FD");
  const [workBorder, setWorkBorder] = useState<string>("");
  const [workTopLeftRadius, setWorkTopLeftRadius] = useState<string>("0px");
  const [workBottomLeftRadius, setWorkBottomLeftRadius] =
    useState<string>("0px");
  const [isOpenCreatePopup, setIsOpenCreatePopup] = useState(false);

  const timeT = useTranslations(NS_TIME_TRACKING);

  const timeTabs: ITab[] = [
    {
      label: timeT("header.tab.myTime"),
      value: "myTime",
    },
    {
      label: timeT("header.tab.companyTime"),
      value: "companyTime",
    },
    {
      label: timeT("header.tab.workLog"),
      value: "timeLog",
    },
  ];

  const onSelectTimeSheetChange = (event: SelectChangeEvent) => {
    setTab(event.target.value);
    setTimeBgColor(isDarkMode ? "#0575E6" : "#D9F0FD");
    setWorkBgColor("#FFFFFF");
    setWorkTopLeftRadius("0px");
    setWorkBottomLeftRadius("0px");
    setWorkBorder("");
  };

  const showHideLogTimePopup = () =>
    setIsOpenCreatePopup((previousState) => !previousState);

  return (
    <Stack>
      <Grid
        container
        sx={{ display: isSmSmaller ? "block" : "none", padding: "10px" }}
      >
        <Grid
          item
          xs={12}
          sx={{ display: "flex", alignItems: "center", gap: "5px" }}
        >
          <ChevronLeftIcon sx={{ width: "20px", height: "20px" }} />{" "}
          <Typography
            sx={{ fontWeight: 600, fontSize: "20px", lineHeight: "24px" }}
          >
            {timeT("header.timeTracking")}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        sx={{
          borderRadius: "12px",
          backgroundColor: isSmSmaller
            ? "inherit"
            : isDarkMode
            ? "#565656"
            : "#FFFFFF",
          display: "flex",
          height: isSmSmaller ? "110px" : "auto",
          justifyContent: "space-between",
        }}
      >
        <Grid
          item
          md={6}
          sm={12}
          //sx={{ display: "flex"}}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "349px",
              height: "36px",
              margin: "22px 22px 0 22px",
              borderRadius: "100px",
              border: "1px solid #EFEFEF",
              backgroundColor: tab === "timelog" ? "#D9F0FD" : "#FFFFFF",
            }}
          >
            <Select
              value={
                tab === timeTabs[0].value
                  ? timeTabs[0].value
                  : timeTabs[1].value
              }
              defaultValue={timeTabs[0].label}
              onChange={onSelectTimeSheetChange}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: "12px",
                    bgcolor: isDarkMode ? "#333333" : "#FFFFFF",
                    fontFamily: "Inter",
                    fontSize: "13px",
                    fontWeight: "Medium",
                  },
                },
              }}
              sx={{
                display: "flex",
                marginLeft: "-1px",
                fontSize: "16px",
                fontFamily: "Inter",
                fontWeight: "Regular",
                textAlign: "center",
                width: "179px",
                height: "54px",
                borderRadius: "100px",
                backgroundColor: timeBgColor,
                color: isDarkMode ? "#FFFFFF" : "#045EB8",
              }}
            >
              <MenuItem value={timeTabs[0].value}>{timeTabs[0].label}</MenuItem>
              <MenuItem value={timeTabs[1].value}>{timeTabs[1].label}</MenuItem>
            </Select>

            <Typography
              sx={{
                display: "flex",
                width: "179px",
                height: "54px",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontFamily: "Inter",
                fontWeight: "Regular",
                color: isDarkMode ? "#FFFFFF" : "#333333",
                border: workBorder,
                borderTopRightRadius: "100px",
                borderBottomRightRadius: "100px",
                borderTopLeftRadius: workTopLeftRadius,
                borderBottomLeftRadius: workBottomLeftRadius,
                backgroundColor: workBgColor,
              }}
              onClick={() => {
                setTab(timeTabs[2].value);
                setWorkBgColor("#D9F0FD");
                setWorkTopLeftRadius("100px");
                setWorkBottomLeftRadius("100px");
                setTimeBgColor("#FFFFFF");
                setWorkBorder("1px solid #EFEFEF");
              }}
            >
              {timeTabs[2].label}
            </Typography>
          </Box>
        </Grid>

        <Box
          sx={{
            display: "flex",
            justifyItems: "flex-end",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "396px",
            height: "56px",
            padding: "16px 22px 0 0",
          }}
        >
          {/* <Button
            startIcon={<ClockIcon />}
            size="small"
            variant="contained"
            sx={{
              display: "flex",
              width: "113px",
              height: "56px",
              borderRadius: "100px",
              background: "linear-gradient(90deg, #2af598, #009efd)",
              "&:hover": {
                background: "linear-gradient(90deg, #2af598, #009efd)",
              },
              color: "common.white",
              textTransform: "none",
              fontSize: "16px",
              fontFamily: "Inter",
              fontWeight: "Bold",
              cursor: "pointer",
            }}
            onClick={showHideLogTimePopup}
          >
            {timeT("header.common.startButton")}
          </Button> */}

          <Button
            startIcon={<PlusIcon />}
            size="small"
            variant="contained"
            sx={{
              display: "flex",
              width: "136px",
              height: "46px",
              marginLeft: "14px",
              borderRadius: "100px",
              background: "linear-gradient(90deg, #2af598, #009efd)",
              "&:hover": {
                background: "linear-gradient(90deg, #2af598, #009efd)",
              },
              color: "common.white",
              textTransform: "none",
              fontSize: "16px",
              fontFamily: "Inter",
              fontWeight: "Bold",
              cursor: "pointer",
            }}
            onClick={showHideLogTimePopup}
          >
            {timeT("header.common.logTimeButton")}
          </Button>
        </Box>

        {/* <Navbar /> */}
      </Grid>

      <TabContext value={tab}>
        {/* <Stack
          direction="row"
          
        > */}

        {/* </Stack> */}
        <TabPanel
          value="myTime"
          sx={{ "& .MuiTabPanel-root": { paddingTop: "0px!important" } }}
          classes={{ root: isSmSmaller ? "tab-panel-top-0" : "" }}
        >
          <MyTimeTrackingCalendar
            events={[]}
            onClick={() => console.log("click")}
            isOpenCreatePopup={isOpenCreatePopup}
          />
        </TabPanel>
        <TabPanel
          value="companyTime"
          sx={{ paddingTop: { sm: 0, md: "auto" } }}
          classes={{ root: isSmSmaller ? "tab-panel-top-0" : "" }}
        >
          <CompanyTimeTrackingCalendar
            events={[]}
            onClick={() => console.log("click")}
          />
        </TabPanel>
        <TabPanel value="timeLog" sx={{ paddingTop: { sm: 0, md: "auto" } }}>
          <TimelogTrackingCalendar
            events={[]}
            onClick={() => console.log("click")}
          />
        </TabPanel>
      </TabContext>
    </Stack>
  );
};

export default TimeTrackingPage;
