"use client";
import { useState } from "react"
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import { useTranslations } from "next-intl";

import { Text } from "components/shared";
import { AN_ERROR_TRY_RELOAD_PAGE, NS_COMMON, NS_COST_RATE } from "constant/index";
import FixedLayout from "components/FixedLayout";
import { useContext } from "hooks/useNonOptionalContext";
import { EmployeeDetailContext } from "./EmployeeDetailContext";
import EmployeeDetailHeader from "./EmployeeDetailHeader";
import EmployeeDetailForm from "./EmployeeDetailForm";
import CostRate from "./CostRate/CostRate";

interface ITab {
  label: string;
  value: string;
}

const EmployeeDetailMain = () => {
  const commonT = useTranslations(NS_COMMON);
  const costRateT = useTranslations(NS_COST_RATE);
  const { employee, onGetProfile, onUpdateUserInfo } = useContext(EmployeeDetailContext);

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

  if (!employee) {
    return (
      <Text variant="body2" textAlign="center" fontWeight={600}>
        {commonT(AN_ERROR_TRY_RELOAD_PAGE)}
      </Text>
    );
  }

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
              <EmployeeDetailHeader
                employee={employee}
                onGetProfile={onGetProfile}
                onUpdateUserInfo={onUpdateUserInfo}
                isEdit={tab == 'userInfo'}
              />
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
            <EmployeeDetailForm employee={employee} onUpdateUserInfo={onUpdateUserInfo} />
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
  );
}

export default EmployeeDetailMain;

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
