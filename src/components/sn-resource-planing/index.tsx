"use client";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Button, Grid, Stack, Tab, Typography } from "@mui/material";
import { Permission } from "constant/enums";
import { NS_RESOURCE_PLANNING } from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";

import useTheme from "hooks/useTheme";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useAuth } from "store/app/selectors";
import AllPeopleTab from "./AllPeopleTab";
import CreateBooking from "./modals/CreateBooking";
import ModalDrop from "./modals/ModalDrop";
import MyScheduleTab from "./MyScheduleTab";
const ResourcePlanning = () => {
  const { isDarkMode } = useTheme();
  const { isSmSmaller, isMdSmaller } = useBreakpoint();
  const { user } = useAuth();

  const [tab, setTab] = useState(
    user?.roles?.includes(Permission.ST) ? "mySchedule" : "allPeople",
  );
  const t = useTranslations(NS_RESOURCE_PLANNING);

  const [isServicePopup, setIsServicePopup] = useState<Boolean>(false);
  const [isWorkload, setIsWorkload] = useState<Boolean>(false);
  const [isModalAdd, setIsModalAdd] = useState<boolean>(false);
  const [projectSelected, setProjectSelected] = useState<string | null>(null);
  const [budgetSelected, setBudgetSelected] = useState<string | null>(null);

  return (
    <Stack
      maxHeight={{ md: "90vh" }}
      overflow={{
        sx: "scroll",
        md: "hidden",
      }}
      sx={{
        ["& .MuiTabPanel-root"]: {
          p: 0,
          marginTop: "16px",
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
            height: isSmSmaller ? "fit-content" : "auto",
            // "&.MuiGrid-root": {
            //   backgroundColor: "background.default",
            // },
            alignItems: "center",
            minHeight: "110px",
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
              flexDirection: isMdSmaller ? "column" : "row",
              gap: "16px",
              width: "100%",
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
                    color: "#333333",
                    fontWeight: 400,
                  },
                },
                "& .MuiTabs-indicator": {
                  display: "none",
                },
                "& .MuiTabs-flexContainer": {
                  borderRadius: "100px",
                  width: isSmSmaller ? "100%" : "297px",
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
                width: isSmSmaller ? "100%" : "fit-content",
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
              + {t("header.add")}
            </Button>
            <CreateBooking
              resourceId={user?.id || ""}
              onClose={() => setIsModalAdd(false)}
              open={isModalAdd}
            />
            {/* <AddBooking setIsModalAdd={setIsModalAdd} isModalAdd={isModalAdd} /> */}
          </Grid>
        </Grid>

        {user?.roles?.includes(Permission.AM) && (
          <TabPanel value="allPeople">
            <AllPeopleTab
              setisServicePopup={setIsServicePopup}
              isWorkload={isWorkload}
              setIsWorkload={setIsWorkload}
              tab={tab}
              projectSelected={projectSelected}
              budgetSelected={budgetSelected}
              isSmSmaller={isSmSmaller}
            />
          </TabPanel>
        )}
        <TabPanel value="mySchedule">
          <MyScheduleTab
            setisServicePopup={setIsServicePopup}
            isWorkload={isWorkload}
            setIsWorkload={setIsWorkload}
            tab={tab}
          />
        </TabPanel>
      </TabContext>
      {isServicePopup && (
        <ModalDrop
          setBudgetSelected={setBudgetSelected}
          setProjectSelected={setProjectSelected}
          setIsServicePopup={setIsServicePopup}
          budgetSelected={budgetSelected}
          projectSelected={projectSelected}
        />
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
