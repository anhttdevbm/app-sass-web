"use client";
import { useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Grid, Tab } from "@mui/material";
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
        <TabContext value={tab}>
          <Grid container alignItems="end">
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
          <TabPanel value="userInfo" >
            <UserInformation />
          </TabPanel>
          <TabPanel value="costRate" >
            <CostRate />
          </TabPanel>
        </TabContext>
      </FixedLayout>
    </>
  );
}

export default UserInformationPage;