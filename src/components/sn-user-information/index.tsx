"use client";
import { useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import { useTranslations } from "next-intl";

import { NS_COST_RATE } from "constant/index";
import FixedLayout from "components/FixedLayout";
import UserInformationHeader from "./UserInformationHeader";
import UserInformation from "./UserInformation";
import CostRate from "./CostRate/CostRate";


interface ITab {
  label: string;
  value: string;
}

const UserInformationPage = () => {
  const [tab, setTab] = useState<string>("userInfo");
  const costRateT = useTranslations(NS_COST_RATE);
  const tabStyles = {
    width: 'auto',
    fontSize: "16px",
    lineHeight: "20px",
    fontWeight: 600,
  };

  const tabs: ITab[] = [
    {
      label: costRateT("head.tab.userInfo"),
      value: "userInfo",
    },
    {
      label: costRateT("head.tab.costRate"),
      value: "costRate",
    },
  ];

  return (
    <>
      <FixedLayout flex={1}>
        <Box
          sx={{
            height: "100%",
            paddingTop: "32px",
            paddingBottom: "48px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TabContext value={tab}>
            <Grid container alignItems="end" pl="48px" pr="32px">
              <Grid item xs={12} md={6}>
                <UserInformationHeader isEdit={tab == 'userInfo'} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TabList
                sx={{
                  "& .MuiTabs-flexContainer": {
                    justifyContent: 'end'
                  },
                  "& .MuiTab-root": {
                    textTransform: "unset",
                    fontSize: "16px",
                    lineHeight: "20px",
                    fontWeight: 600,
                    color: "#333333",
                    "&.active": {
                      color: "#045EB8",
                    },
                  },
                }}
                  onChange={(_event: React.SyntheticEvent, newValue: string) =>
                    setTab(newValue)
                  }
                >
                  {tabs.map((tab: ITab) => (
                    <Tab
                      key={`tab-${tab.value}`}
                      label={tab.label}
                      value={tab.value}
                      sx={tabStyles}
                    />
                  ))}
                </TabList>
              </Grid>
            </Grid>
            <TabPanel
              value="userInfo"
              sx={{
                padding: 0,
                flexGrow: 1,
                "&:not([hidden])": {
                  display: "flex",
                  flexDirection: "column",
                  overflowX: "hidden",
                  overflowY: "scroll",
                },
              }}
            >
              <UserInformation />
            </TabPanel>
            <TabPanel
              value="costRate"
              sx={{
                padding: 0,
                flexGrow: 1,
                "&:not([hidden])": {
                  display: "flex",
                  flexDirection: "column",
                  overflowX: "hidden",
                  overflowY: "scroll",
                },
              }}
            >
              <CostRate />
            </TabPanel>
          </TabContext>
        </Box>
      </FixedLayout>
    </>
  );
}

export default UserInformationPage;