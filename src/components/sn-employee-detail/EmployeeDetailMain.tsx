"use client";
import { useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import { useTranslations } from "next-intl";

import { NS_COST_RATE } from "constant/index";
import FixedLayout from "components/FixedLayout";
import EmployeeDetailHeader from "./EmployeeDetailHeader";
import EmployeeDetailForm from "./EmployeeDetailForm";
import CostRate from "./CostRate/CostRate";

interface ITab {
  label: string;
  value: string;
}

const EmployeeDetailMain = () => {
  const costRateT = useTranslations(NS_COST_RATE);

  const [tab, setTab] = useState<string>("userInfo");
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
    <FixedLayout flex={1}>
      <Box
        sx={{
          height: "100%",
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
              <EmployeeDetailHeader isEdit={tab == "userInfo"} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TabList
                sx={{
                  minHeight: 44,
                  mt: {
                    xs: 5,
                    sm: "initial",
                  },
                  justifyContent: {
                    xs: "center",
                    sm: "end",
                  },
                  "& .MuiTabs-scroller": {
                    width: "initial",
                    flex: "0 0 auto",
                  },
                  "& .MuiTabs-flexContainer": {
                    position: "relative",
                    zIndex: 10,
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
          <TabPanel value="userInfo" sx={tabPanelStyles}>
            <EmployeeDetailForm />
          </TabPanel>
          <TabPanel value="costRate" sx={tabPanelStyles}>
            <CostRate />
          </TabPanel>
        </TabContext>
      </Box>
    </FixedLayout>
  );
};

export default EmployeeDetailMain;

const tabStyles = {
  minHeight: 44,
  width: "auto",
  px: 3,
  py: 0,
  border: "1px solid",
  borderStyle: "solid",
  borderColor: "transparent",
  borderTopColor: "#EFEFEF",
  borderBottomColor: "#EFEFEF",
  textTransform: "unset",
  fontSize: "16px",
  fontWeight: 400,
  color: "#333333",
  "&.Mui-selected": {
    color: "#045EB8",
  },
  "& .MuiTouchRipple-root": {
    borderRadius: "9999px",
  },
  "&:first-of-type": {
    borderTopLeftRadius: "9999px",
    borderBottomLeftRadius: "9999px",
    borderLeftColor: "#EFEFEF",
  },
  "&:last-of-type": {
    borderTopRightRadius: "9999px",
    borderBottomRightRadius: "9999px",
    borderRightColor: "#EFEFEF",
  },
};

const tabPanelStyles = {
  padding: 0,
  flexGrow: 1,
  "&:not([hidden])": {
    display: "flex",
    flexDirection: "column",
    overflowX: "hidden",
    overflowY: "scroll",
  },
};
