"use client";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { ReactNode, useCallback, useEffect } from "react";

import { Text } from "components/shared";
import { DataStatus } from "constant/enums";
import { AN_ERROR_TRY_RELOAD_PAGE, NS_COMMON } from "constant/index";
import { UpdateUserInfoData } from "store/app/actions";
import { UserInfo } from "store/app/reducer";
import { useAuth, useUserInfo } from "store/app/selectors";
import { UpdateEmployee } from "store/employeeDetail/actions";
import { useEmployeeDetail } from "store/employeeDetail/selectors";
import { EmployeeDetailContextProvider } from "./EmployeeDetailContext";
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

const ErrorPage = () => {
  const commonT = useTranslations(NS_COMMON);

  return (
    <Text variant="body2" textAlign="center" fontWeight={600}>
      {commonT(AN_ERROR_TRY_RELOAD_PAGE)}
    </Text>
  );
}

const UserInformationProvider = ({ type, children }: EmployeeDetailPageProps & { children: ReactNode }) => {
  const { user: employee, onGetProfile } = useAuth();
  const { onUpdateUserInfo } = useUserInfo();

  if (!employee) {
    return <ErrorPage />
  }

  return (
    <EmployeeDetailContextProvider value={{
      type,
      employee,
      onGetProfile,
      onUpdateUserInfo
    }}>
      {children}
    </EmployeeDetailContextProvider>
  );
}

const EmployeeDetailProvider = ({ type, children }: EmployeeDetailPageProps & { children: ReactNode }) => {
  const {
    employee,
    status,
    handleGetEmployeeDetail,
    handleUpdateEmployee,
    handleResetEmployee,
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
  }, [status, onGetProfile]);

  useEffect(() => {
    return () => { handleResetEmployee() };
  }, [handleResetEmployee]);

  if (!employee) {
    return <ErrorPage />
  }

  return (
    <EmployeeDetailContextProvider value={{
      type,
      employee: employee as UserInfo,
      onGetProfile,
      onUpdateUserInfo
    }}>
      {children}
    </EmployeeDetailContextProvider>
  );
}

const EmployeeDetailPage = (props: EmployeeDetailPageProps) => {
  switch (props.type) {
    case "SELF":
      return (
        <UserInformationProvider type={props.type}>
          <EmployeeDetailMain />
        </UserInformationProvider>
      );
    case "EMPLOYEE_DETAIL":
      return (
        <EmployeeDetailProvider type={props.type}>
          <EmployeeDetailMain />
        </EmployeeDetailProvider>
      );
  }
}

export default EmployeeDetailPage;