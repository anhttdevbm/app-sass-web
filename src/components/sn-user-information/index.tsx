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
    px: "36px",
    border: "1px solid",
    borderStyle: "solid",
    borderColor: "transparent",
    borderTopColor: "#EFEFEF",
    borderBottomColor: "#EFEFEF",
    "& .MuiTouchRipple-root": {
      borderRadius: "9999px",
    },
    "&:first-child": {
      borderTopLeftRadius: "9999px",
      borderBottomLeftRadius: "9999px",
      borderLeftColor: "#EFEFEF",
    },
    "&:last-child": {
      borderTopRightRadius: "9999px",
      borderBottomRightRadius: "9999px",
      borderRightColor: "#EFEFEF",
    },
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
            marginBottom: {
              xs: "48px",
              sm: "initial",
            },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TabContext value={tab}>
            <Grid
              container
              alignItems="end"
              pl={{
                xs: "24px",
                sm: "48px",
              }}
              pr={{
                xs: "24px",
                sm: "32px",
              }}
              mt="32px"
              mb="48px"
            >
              <Grid item xs={12} md={6}>
                <UserInformationHeader isEdit={tab == 'userInfo'} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TabList
                sx={{
                  mt: {
                    xs: "24px",
                    sm: "initial",
                  },
                  "& .MuiTab-root": {
                    textTransform: "unset",
                    fontSize: "16px",
                    lineHeight: "25px",
                    fontWeight: 400,
                    color: "#333333",
                    "&.Mui-selected": {
                      color: "#045EB8",
                    },
                  },
                  "& .MuiTabs-flexContainer": {
                    position: "relative",
                    zIndex: 10,
                    justifyContent: {
                      xs: "center",
                      sm: "end",
                    }
                  },
                  "& .MuiTabs-indicator": {
                    height: "100%",
                    borderRadius: "9999px",
                    backgroundColor: "#D9F0FD",
                    zIndex: 1,
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