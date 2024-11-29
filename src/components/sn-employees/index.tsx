"use client";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Tab from "@mui/material/Tab";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { client, Endpoint } from "api";
import { EmployeeType } from "constant/enums";
import { AUTH_API_URL, NS_COMPANY } from "constant/index";
import Actions from "./Actions";
import ItemList from "./ItemList";
import ItemListJoinRequest from "./join-request/ItemListJoinRequest";

const EmployeesPage = () => {
  const companyT = useTranslations(NS_COMPANY);
  const [totalUserUnPaid, setTotalUserUnPaid] = useState(null);

  const [tab, setTab] = useState<EmployeeType>(EmployeeType.EMPLOYEE);
  const searchParams = useSearchParams();
  const typeEmployeeParams = useMemo(
    () => searchParams.get("typeEmployee") as EmployeeType,
    [searchParams],
  );
  useEffect(() => {
    setTab(typeEmployeeParams || EmployeeType.EMPLOYEE);
  }, [typeEmployeeParams]);

  const handleSetTab = useCallback(
    (_event: React.SyntheticEvent, newValue: EmployeeType) => {
      setTab(newValue);
    },
    [],
  );

  useEffect(() => {
    const fetchTotalUserUnPaid = async () => {
      const response = await client.get(
        Endpoint.TOTAL_USER_UNPAID,
        {},
        { baseURL: AUTH_API_URL },
      );
      setTotalUserUnPaid(response.data.total_user_un_paid);
    };

    fetchTotalUserUnPaid();
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
              onChange={handleSetTab}
            >
              <Tab
                label={companyT("employees.employee")}
                value={EmployeeType.EMPLOYEE}
                sx={tabStyles}
              />
              <Tab
                label={companyT("employees.client")}
                value={EmployeeType.CLIENT}
                sx={tabStyles}
              />
              <Tab
                label={companyT("employees.contractor")}
                value={EmployeeType.CONTRACTOR}
                sx={tabStyles}
              />
              {/* <Tab
                label={`${companyT("employees.joinRequest")} (${totalUserUnPaid})`}
                value={EmployeeType.JOIN_REQUEST}
                sx={tabStyles}
              /> */}
              <Tab
                label={
                  <span>
                    {companyT("employees.joinRequest")}{' '}
                    <button style={{ borderRadius: '50%', padding: '5px 10px', border: 'none', backgroundColor: '#045EB8', color: "#fff" }}>
                      {totalUserUnPaid}
                    </button>
                  </span>
                }
                value={EmployeeType.JOIN_REQUEST}
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
        <TabPanel
          value={EmployeeType.CONTRACTOR.toString()}
          sx={tabPanelStyles}
        >
          <ItemList employeeType={EmployeeType.CONTRACTOR} />
        </TabPanel>
        <TabPanel
          value={EmployeeType.JOIN_REQUEST.toString()}
          sx={tabPanelStyles}
        >
          <ItemListJoinRequest employeeType={EmployeeType.JOIN_REQUEST} />
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
}

const tabPanelStyles = {
  px: 3,
  pt: 1,
  pb: 3,
};
