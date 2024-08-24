/* eslint-disable no-console */
"use client";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { TabPanel } from "@mui/lab";
import TabContext from "@mui/lab/TabContext";
import {
  Box,
  Button,
  Fab,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { NS_TIME_TRACKING } from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";
import useTheme from "hooks/useTheme";
import DayIcon from "icons/DayIcon";
import { useTranslations } from "next-intl";
import { FC, useEffect, useState } from "react";
import {
  CompanyTimeTrackingCalendar,
  MyTimeTrackingCalendar,
  TimelogTrackingCalendar,
} from "./CalendarTracking";
import CalendarIcon from "./icons/CalendarIcon";
import TimeSheetIcon from "./icons/TimeSheetIcon";

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
  const [kindOfSheet, setKindOfSheet] = useState<string>("timeSheet");

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

  const showLogTimePopup = () =>
    setIsOpenCreatePopup((previousState) => !previousState);

  useEffect(() => {
    console.log(tab);
    console.log(kindOfSheet);
  }, [tab, kindOfSheet]);

  const handleListSheet = () => {
    switch (tab) {
      case "myTime":
        setKindOfSheet("timeSheet");
        break;
      case "companyTime":
        setKindOfSheet("timeSheet");
        break;
      case "timeLog":
        break;
      default:
        break;
    }
  };
  const handleShowTimeGrid = () => {
    switch (tab) {
      case "myTime":
        setKindOfSheet("timeGridWeek");
        break;
      case "companyTime":
        setKindOfSheet("timeGridWeek");
        break;
      case "timeLog":
        break;
      default:
        break;
    }
  };
  const handleShowTable = () => {
    switch (tab) {
      case "myTime":
        setKindOfSheet("table");
        break;
      case "companyTime":
        setKindOfSheet("table");
        break;
      case "timeLog":
        break;
      default:
        break;
    }
  };

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
          height: isSmSmaller ? "110px" : "auto",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "46px",
            margin: "22px 22px 0 22px",
            borderRadius: "100px",
            border: "1px solid #EFEFEF",
            backgroundColor: tab === "timelog" ? "#D9F0FD" : "#FFFFFF",
            "&:hover": {
              border: "none",
            },
            "&:focus": {
              border: "none",
            },
          }}
        >
          <Select
            value={
              tab === timeTabs[0].value ? timeTabs[0].value : timeTabs[1].value
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
              width: "159px",
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
              cursor: "pointer",
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

        <Box
          sx={{
            height: "56px",
            margin: "16px 22px 0 0",
            display: "flex",
            alignItems: "center",
            gap: "1px",
          }}
        >
          <Fab
            sx={{
              width: "34px",
              height: "34px",
              borderRadius: "100px",
              backgroundColor: "#FFFFFF",
              "&:hover": {
                border: "none",
                backgroundColor: "#F2F5FA",
              },
              "&:focus": {
                border: "none",
                backgroundColor: "#F2F5FA",
              },
              cursor: "pointer",
            }}
            onClick={handleListSheet}
          >
            {
              <TimeSheetIcon
                sx={{
                  width: "18px",
                  height: "18px",
                }}
              />
            }
          </Fab>

          {tab === "companyTime" && (
            <Fab
              sx={{
                width: "34px",
                height: "34px",
                borderRadius: "100px",
                backgroundColor: "#FFFFFF",
                "&:hover": {
                  border: "none",
                  backgroundColor: "#F2F5FA",
                },
                "&:focus": {
                  border: "none",
                  backgroundColor: "#F2F5FA",
                },
                cursor: "pointer",
              }}
              onClick={handleShowTable}
            >
              <DayIcon
                sx={{
                  width: "18px",
                  height: "18px",
                }}
              />
            </Fab>
          )}


          <Fab
            sx={{
              width: "34px",
              height: "34px",
              borderRadius: "100px",
              backgroundColor: "#FFFFFF",
              "&:hover": {
                border: "none",
                backgroundColor: "#F2F5FA",
              },
              "&:focus": {
                border: "none",
                backgroundColor: "#F2F5FA",
              },
              cursor: "pointer",
            }}
            // onClick={showLogTimePopup}
            onClick={handleShowTimeGrid}
          >
            {
              <CalendarIcon
                sx={{
                  width: "18px",
                  height: "18px",
                }}
              />
            }
          </Fab>



          <Button
            // startIcon={<PlusIcon />}
            variant="contained"
            sx={{
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
              fontWeight: "Bold",
              cursor: "pointer",
            }}
            onClick={showLogTimePopup}
          >
            {timeT("header.common.logTimeButton")}
          </Button>
        </Box>
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
            currentKindOfSheet={kindOfSheet}
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
            isOpenCreatePopup={isOpenCreatePopup}
            currentKindOfSheet={kindOfSheet}
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
