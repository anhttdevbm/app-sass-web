"use client";
import { AddOutlined } from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tab,
  Typography,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Select } from "components/shared";
import { Permission } from "constant/enums";
import { NS_RESOURCE_PLANNING } from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";
import useTheme from "hooks/useTheme";
import SearchIcon from "icons/SearchIcon";
import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";
import { useAuth } from "store/app/selectors";
import { useProjects } from "store/project/selectors";
import { useGetServiceBudget } from "store/resourcePlanning/selector";
import { useSalesService } from "store/sales/selectors";
import AllPeopleTab from "./AllPeopleTab";
import GuideIcon from "./assets/GuideIcon";
import VueSaxIcon from "./assets/VueSaxIcon";
import AddBooking from "./modals/addBooking";
import MyScheduleTab from "./MyScheduleTab";

const ResourcePlanning = () => {
  const { isDarkMode } = useTheme();
  const { isSmSmaller } = useBreakpoint();
  const { user } = useAuth();
  const { items } = useProjects();
  const { budgets } = useGetServiceBudget();
  const { serviceSectionList, onGetService } = useSalesService();

  const [tab, setTab] = useState(
    user?.roles?.includes(Permission.ST) ? "mySchedule" : "allPeople",
  );
  const t = useTranslations(NS_RESOURCE_PLANNING);

  const [isServicePopup, setisServicePopup] = useState<Boolean>(false);
  const [isWorkload, setIsWorkload] = useState<Boolean>(false);
  const [isModalAdd, setIsModalAdd] = useState<Boolean>(false);
  const [programSelected, setProgramSelected] = useState<string | null>(null);
  const [budgetSelected, setBudgetSelected] = useState<string | null>(null);

  const listProjects =
    useMemo(
      () => items.map((item) => ({ value: item?.id, label: item?.name })),
      [items],
    ) || [];

  const listBudgets =
    useMemo(
      () => budgets?.map((item) => ({ value: item?.id, label: item?.name })),
      [items],
    ) || [];

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
            <AddBooking setIsModalAdd={setIsModalAdd} isModalAdd={isModalAdd} />
          </Grid>
        </Grid>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          // localeText={
          //   viVN.components.MuiLocalizationProvider.defaultProps.localeText
          // }
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
            width: "316px",
            height: "fit-content",
            zIndex: "100",
            background: "white",
            borderRadius: "12px",
            color: "black",
            padding: "16px",
          }}
          boxShadow={" -4px 10px 30px 0px #0000001A;"}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              font: "13px",
            }}
            display={"flex"}
            gap={1}
            alignItems={"center"}
          >
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: "700",
                whiteSpace: "nowrap",
                color: "#7A869A",
              }}
            >
              {t("popupService.project")}{" "}
              <span style={{ color: "red" }}>*</span>
            </Typography>
            <Select
              options={listProjects}
              fullWidth
              value={programSelected}
              onChange={(e) => setProgramSelected(e.target.value)}
              rootSx={{
                padding: 2,
                height: 36,
                background: "white",
                borderRadius: "50px",
                borderColor: " #EFEFEF",
              }}
            />
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ marginTop: "15px", font: "13px", fontWeight: "700" }}
            alignItems={"center"}
            gap={1}
          >
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: "700",
                whiteSpace: "nowrap",
                color: "#7A869A",
              }}
            >
              {t("popupService.budget")} <span style={{ color: "red" }}>*</span>
            </Typography>
            <Select
              options={listBudgets}
              fullWidth
              placeholder={t("popupService.chooseBudgetPlacehodle")}
              rootSx={{
                padding: 2,
                height: 36,
                background: "white",
                borderRadius: "50px",
                borderColor: " #EFEFEF",
              }}
              value={budgetSelected}
              onChange={(e) => setBudgetSelected(e.target.value)}
            />
          </Stack>
          <Button
            sx={{
              height: "32px",
              background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
              margin: "15px auto",
              borderRadius: "100px",
              textTransform: "unset",
              color: "white",
            }}
            fullWidth
          >
            {t("popupService.search")}
          </Button>
          <TextField
            variant="outlined"
            placeholder="Enter summary or service key"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "black", fontWeight: "bold" }} />
                </InputAdornment>
              ),
              style: {
                borderRadius: "50px",
                padding: "0 10px 0 10px",
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
          <Box pt={"14px"}>
            <Stack direction="row" alignItems="center" gap={2}>
              <Typography
                variant="h6"
                gutterBottom
                color={"#7A869A"}
                whiteSpace={"nowrap"}
              >
                Date <span style={{ color: "red" }}>*</span>
              </Typography>
              <DateRangePicker
                slots={{ field: SingleInputDateRangeField }}
                // name="allowedRange"

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
                  width: "100%",
                }}
              />
            </Stack>

            <Typography
              variant="subtitle1"
              gutterBottom
              fontSize={13}
              marginTop={2}
              fontWeight="bold"
            >
              <GuideIcon /> Drag service to the calendar
            </Typography>
            <Typography
              variant="body1"
              color="#44546F"
              gutterBottom
              fontSize={11}
              marginTop={2}
              fontWeight={700}
              display={"flex"}
              alignItems={"center"}
              gap={"4px"}
            >
              <VueSaxIcon /> 02/17 service
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
                borderColor: "#E1D3D3",
              }}
            >
              <Typography fontSize={11}>Service 1</Typography>
              <IconButton>
                <AddOutlined
                  color="primary"
                  sx={{
                    background:
                      "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
                    borderRadius: "100px",
                    fontSize: "16px",
                    color: "white",
                    overflow: "hidden",
                  }}
                />
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
                borderColor: "#E1D3D3",
              }}
            >
              <Typography fontSize={11}>Service 1</Typography>
              <IconButton>
                <AddOutlined
                  color="primary"
                  sx={{
                    background:
                      "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
                    borderRadius: "100px",
                    fontSize: "16px",
                    color: "white",
                    overflow: "hidden",
                  }}
                />
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
