"use client";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Stack, Typography, Tab, Grid, Input, Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { viVN } from "@mui/x-date-pickers/locales";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { NS_RESOURCE_PLANNING } from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import AllPeopleTab from "./AllPeopleTab";
import MyScheduleTab from "./MyScheduleTab";
import useTheme from "hooks/useTheme";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useAuth } from "store/app/selectors";
import ROLE from "components/sn-time-tracking/Component/Constants/Enums/Roles.enum";
import { Permission } from "constant/enums";
import { Button } from "@mui/material";
import { Search } from "@mui/icons-material";
import SearchIcon from "icons/SearchIcon";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { IconButton, Paper } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import AddBooking from "./modals/addBooking";

const ResourcePlanning = () => {
  const { isDarkMode } = useTheme();
  const { isSmSmaller } = useBreakpoint();
  const { user } = useAuth();
  const [tab, setTab] = useState(
    user?.roles?.includes(Permission.ST) ? "mySchedule" : "allPeople",
  );
  const t = useTranslations(NS_RESOURCE_PLANNING);

  const [isServicePopup, setisServicePopup] = useState<Boolean>(false);
  const [isWorkload, setIsWorkload] = useState<Boolean>(false);
  const [isModalAdd, setIsModalAdd] = useState<Boolean>(false);

  return (
    <Stack
      maxHeight={{ md: "90vh" }}
      overflow={{
        sx: "scroll",
        md: "hidden",
      }}
      sx={{
        ["& .MuiTabPanel-root"]: {
          p: {
            xs: "10px",
            md: "20px",
          },
        },
        position: "relative",
      }}
      minWidth={350}
    >
      <Grid
        container
        sx={{
          display: isSmSmaller ? "block" : "none",
          padding: "10px",
        }}
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
            {t("header.title")}
          </Typography>
        </Grid>
      </Grid>
      <TabContext value={tab}>
        <Grid
          container
          sx={{
            height: isSmSmaller ? "110px" : "auto",
            // "&.MuiGrid-root": {
            //   backgroundColor: "background.default",
            // },
            alignItems: "center",
          }}
        >
          <Grid
            item
            md={12}
            sm={12}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "22px",
              marginLeft: "16px",
              marginRight: "16px",
            }}
          >
            <TabList
              sx={{
                "& .MuiTab-root": {
                  borderRadius: "100px", // Bo góc cho các tab
                  textTransform: "none",
                  fontWeight: "bold",
                  mx: 1, // Khoảng cách giữa các tab
                  margin: 0,
                  "&.Mui-selected": {
                    backgroundColor: "rgba(0, 123, 255, 0.1)", // Màu nền cho tab được chọn
                    color: "primary.main",
                  },
                  "&:not(.Mui-selected)": {
                    backgroundColor: "transparent", // Màu nền cho tab không được chọn
                    color: "text.secondary",
                  },
                },
                "& .MuiTabs-indicator": {
                  display: "none",
                },
                "& .MuiTabs-flexContainer": {
                  borderRadius: "100px",
                  width: "297px",
                  height: "56px",
                  border: "1px solid rgba(0, 123, 255, 0.1)",
                },
              }}
              onChange={(_event: React.SyntheticEvent, newValue: string) =>
                setTab(newValue)
              }
            >
              {user?.roles?.includes(Permission.AM) && (
                <Tab
                  label={t("header.tab.allPeople")}
                  value="allPeople"
                  sx={tabStyles}
                />
              )}
              <Tab
                label={t("header.tab.mySchedule")}
                value="mySchedule"
                sx={tabStyles}
              />
            </TabList>
            <Button
              sx={{
                width: "100px",
                height: "40px",
                fontSize: "16px",
                background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
                color: "white",
                borderRadius: "100px",
                padding: "10px 20px",
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)", // Giữ nguyên gradient khi hover
                  opacity: 0.9, // Giảm độ trong suốt khi hover
                },
              }}
              onClick={() => {
                setIsModalAdd((prev) => !prev);
              }}
            >
              + Add
            </Button>
            {isModalAdd && <AddBooking setIsModalAdd={setIsModalAdd} />}
          </Grid>
        </Grid>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          localeText={
            viVN.components.MuiLocalizationProvider.defaultProps.localeText
          }
        >
          {user?.roles?.includes(Permission.AM) && (
            <TabPanel value="allPeople">
              <AllPeopleTab
                setisServicePopup={setisServicePopup}
                isWorkload={isWorkload}
                setIsWorkload={setIsWorkload}
                tab={tab}
              />
            </TabPanel>
          )}
          <TabPanel value="mySchedule">
            <MyScheduleTab
              setisServicePopup={setisServicePopup}
              isWorkload={isWorkload}
              setIsWorkload={setIsWorkload}
              tab={tab}
            />
          </TabPanel>
        </LocalizationProvider>
      </TabContext>
      {isServicePopup && (
        <Stack
          sx={{
            position: "absolute",
            top: "180px",
            right: "70px",
            border: "1px solid #DDDDDD",
            width: "316px",
            height: "406px",
            zIndex: "100",
            background: "white",
            borderRadius: "12px",
            color: "black",
            padding: "8px",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              font: "13px",
              fontWeight: "700",
              marginTop: "10px",
            }}
          >
            <Typography sx={{ fontSize: "13px", fontWeight: "700" }}>
              {t("popupService.project")}{" "}
              <span style={{ color: "red" }}>*</span>
            </Typography>
            <input
              placeholder={t("popupService.chooseProjectPlacehodle")}
              style={{
                border: "1px solid black",
                color: "black",
                borderRadius: "10px",
                background: "white",
                width: "207px",
                height: "23px",
                fontSize: "10px",
                paddingLeft: "5px",
                marginRight: "10px",
              }}
            />
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ marginTop: "15px", font: "13px", fontWeight: "700" }}
          >
            <Typography sx={{ fontSize: "13px", fontWeight: "700" }}>
              {t("popupService.budget")} <span style={{ color: "red" }}>*</span>
            </Typography>
            <input
              placeholder={t("popupService.chooseBudgetPlacehodle")}
              style={{
                border: "1px solid black",
                color: "black",
                borderRadius: "10px",
                background: "white",
                width: "207px",
                height: "23px",
                fontSize: "10px",
                paddingLeft: "5px",
                marginRight: "10px",
              }}
            />
          </Stack>
          <Button
            sx={{
              width: "256px",
              height: "32px",
              background: "#2AF598",
              margin: "15px auto",
              borderRadius: "10px",
            }}
          >
            {t("popupService.search")}
          </Button>
          <TextField
            variant="outlined"
            placeholder="Enter summary or service key"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "black", fontWeight: "bold" }} />
                </InputAdornment>
              ),
              style: {
                borderRadius: "50px",
                padding: "0 10px 0 10px",
                width: "265px",
                height: "32px",
                margin: "0 auto",
                fontSize: "10px",
                border: "1px solid blue",
              },
              inputProps: {
                style: {
                  color: "black",
                  fontWeight: "bold",
                },
              },
            }}
          />
          <Box sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center">
              <Typography variant="h6" gutterBottom>
                Date <span style={{ color: "red" }}>*</span>
              </Typography>
              <DateRangePicker
                slots={{ field: SingleInputDateRangeField }}
                name="allowedRange"
                sx={{
                  "& .MuiOutlinedInput-input": {
                    padding: "5px",
                    fontSize: "14px",
                    width: "190px",
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "50px",
                  },
                  marginLeft: "5px",
                }}
              />
            </Stack>

            <Typography
              variant="subtitle1"
              gutterBottom
              fontSize={14}
              marginTop={2}
              fontWeight="bold"
            >
              🎵 Drag service to the calendar
            </Typography>
            <Typography
              variant="body1"
              color="primary"
              gutterBottom
              fontSize={11}
              marginTop={2}
            >
              📦 02/17 service
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                mb: 1,
                borderStyle: "dashed",
                height: "32px",
                marginTop: "15px",
              }}
            >
              <Typography fontSize={11}>Service 1</Typography>
              <IconButton>
                <AddCircleOutlineIcon color="primary" />
              </IconButton>
            </Paper>
            <Paper
              variant="outlined"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                mb: 1,
                borderStyle: "dashed",
                height: "32px",
                marginTop: "15px",
              }}
            >
              <Typography fontSize={11}>Service 1</Typography>
              <IconButton>
                <AddCircleOutlineIcon color="primary" />
              </IconButton>
            </Paper>
          </Box>
        </Stack>
      )}
    </Stack>
  );
};

const tabStyles = {
  width: "50%",
  fontSize: "16px",
  lineHeight: "20px",
  fontWeight: 600,
};

export default ResourcePlanning;
