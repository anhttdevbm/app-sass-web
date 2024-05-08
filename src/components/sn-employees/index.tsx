"use client";
import { useCallback, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Tab from "@mui/material/Tab";

import { EmployeeType } from "constant/enums";
import Actions from "./Actions";
import ItemList from "./ItemList";

const EmployeesPage = () => {
  const [tab, setTab] = useState<EmployeeType>(EmployeeType.EMPLOYEE);

  const handleSetTab = useCallback((employeeType: EmployeeType) => {
    setTab(employeeType);
  }, []);

  return (
    <>
      <TabContext value={tab}>
        <Actions
          tabSwitcher={
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
              onChange={(
                _event: React.SyntheticEvent,
                newValue: EmployeeType,
              ) => setTab(newValue)}
            >
              <Tab
                label="Employee"
                value={EmployeeType.EMPLOYEE}
                sx={tabStyles}
              />
              <Tab label="Client" value={EmployeeType.CLIENT} sx={tabStyles} />
              <Tab
                label="Contractor"
                value={EmployeeType.CONTRACTOR}
                sx={tabStyles}
              />
            </TabList>
          }
        />
        <TabPanel value={EmployeeType.EMPLOYEE.toString()} sx={tabPanelStyles}>
          <ItemList employeeType={EmployeeType.EMPLOYEE} />
        </TabPanel>
        <TabPanel value={EmployeeType.CLIENT.toString()} sx={tabPanelStyles}>
          <ItemList employeeType={EmployeeType.CLIENT} />
        </TabPanel>
        <TabPanel value={EmployeeType.CONTRACTOR.toString()} sx={tabPanelStyles}>
          <ItemList employeeType={EmployeeType.CONTRACTOR} />
        </TabPanel>
      </TabContext>
    </>
  );
};

export default EmployeesPage;

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
  px: 3,
  pt: 1,
  pb: 3,
}
