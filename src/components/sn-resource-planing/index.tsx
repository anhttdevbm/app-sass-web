"use client";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Stack, Typography, Tab, Grid } from "@mui/material";
import { LocalizationProvider, viVN } from "@mui/x-date-pickers";
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

const ResourcePlanning = () => {
  const { isDarkMode } = useTheme();
  const { isSmSmaller } = useBreakpoint();
  const { user } = useAuth();
  const [tab, setTab] = useState(
    user?.roles?.includes(Permission.ST) ? "mySchedule" : "allPeople",
  );
  const t = useTranslations(NS_RESOURCE_PLANNING);

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
            "&.MuiGrid-root": {
              backgroundColor: "background.default",
            },
            alignItems: "center",
          }}
        >
          <Grid item md={6} sm={12}>
            <TabList
              sx={{
                "& .MuiTabs-flexContainer": {
                  gap: "16px",
                  display: "grid",
                  gridTemplateColumns: isSmSmaller
                    ? "0.9fr 1.2fr 0.9fr"
                    : "repeat(3, 1fr)",
                },

                "& .MuiTab-root": {
                  textTransform: "unset",
                  fontSize: "16px",
                  lineHeight: "20px",
                  fontWeight: 600,
                  color: "rgba(153, 153, 153, 1)",
                  "&.active": {
                    color: "#3699FF",
                  },
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
              <AllPeopleTab />
            </TabPanel>
          )}
          <TabPanel value="mySchedule">
            <MyScheduleTab />
          </TabPanel>
        </LocalizationProvider>
      </TabContext>
    </Stack>
  );
};

const tabStyles = {
  width: "auto",
  fontSize: "16px",
  lineHeight: "20px",
  fontWeight: 600,
};

export default ResourcePlanning;
