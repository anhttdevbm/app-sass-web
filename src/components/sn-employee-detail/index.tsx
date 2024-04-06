"use client";
import { ReactNode, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";

import { DataStatus } from "constant/enums";
import { useAuth, useUserInfo } from "store/app/selectors";
import { UpdateUserInfoData } from "store/app/actions";
import { UpdateEmployee } from "store/employeeDetail/actions";
import { reset } from "store/employeeDetail/reducer";
import { useEmployeeDetail } from "store/employeeDetail/selectors";
import { EmployeeDetailContext } from "./EmployeeDetailContext";
import EmployeeDetailMain from "./EmployeeDetailMain";

// // TypeScript discriminated union
// type UserInformationProps = {
//   type: "SELF";
// }

// type EmployeeDetailProps = {
//   type: "EMPLOYEE_DETAIL";
//   employeeId: string;
// }

// export type EmployeeDetailPageProps = UserInformationProps | EmployeeDetailProps;

export type EmployeeDetailPageProps = {
  type: "SELF" | "EMPLOYEE_DETAIL";
}

const UserInformationProvider = ({children}: { children: ReactNode }) => {
  const { user: employee, onGetProfile } = useAuth();
  const { onUpdateUserInfo } = useUserInfo();

  return (
    <EmployeeDetailContext.Provider value={{
      employee,
      onGetProfile,
      onUpdateUserInfo
    }}>
      {children}
    </EmployeeDetailContext.Provider>
  );
}

const EmployeeDetailProvider = ({children}: { children: ReactNode }) => {
  const {
    employee,
    status,
    handleGetEmployeeDetail,
    handleUpdateEmployee,
  } = useEmployeeDetail();
  const params = useParams() as { id: string };

  const onGetProfile = useCallback(() => {
    handleGetEmployeeDetail(params.id);
  }, [handleGetEmployeeDetail, params.id])

  const onUpdateUserInfo = useCallback(async (data: UpdateUserInfoData) => {
    const payload = { ...data, id: params.id } as UpdateEmployee;
    await handleUpdateEmployee(payload);
  }, [handleUpdateEmployee, params.id]);

  useEffect(() => {
    if (status === DataStatus.IDLE) {
      onGetProfile()
    }
    return () => { reset() };
  }, [status, onGetProfile]);

  return (
    <EmployeeDetailContext.Provider value={{
      employee,
      onGetProfile,
      onUpdateUserInfo
    }}>
      {children}
    </EmployeeDetailContext.Provider>
  );
}

const EmployeeDetailPage = (props: EmployeeDetailPageProps) => {
  switch (props.type) {
    case "SELF":
      return (
        <UserInformationProvider>
          <EmployeeDetailMain />
        </UserInformationProvider>
      );
    case "EMPLOYEE_DETAIL":
      return (
        <EmployeeDetailProvider>
          <EmployeeDetailMain />
        </EmployeeDetailProvider>
      );
  }
}

export default EmployeeDetailPage;