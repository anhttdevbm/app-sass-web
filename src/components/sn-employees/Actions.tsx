"use client";
import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { memo, ReactNode, useEffect, useMemo, useState } from "react";

import { Dropdown, Search } from "components/NewFilters";
import { NewButton as Button } from "components/shared";
import {
  DataAction,
  EmployeeType,
  PayStatus,
  Permission,
} from "constant/enums";
import { NS_COMMON, NS_COMPANY } from "constant/index";
import useToggle from "hooks/useToggle";
import AddCircleIcon from "icons/AddCircleIcon";
import { useAuth } from "store/app/selectors";
import { useEmployees } from "store/company/selectors";
import { usePositionOptions } from "store/global/selectors";
import { getPath } from "utils/index";
import StatusDropdown from "./components/StatusDropdown";
import EmployeeCompanyForm from "./EmployeeCompanyForm";
import EmployeeTypeForm from "./EmployeeTypeForm";
import { TEXT_STATUS } from "./helpers";
const Actions = ({ tabSwitcher }: { tabSwitcher: ReactNode }) => {
  const {
    options,
    onGetOptions,
    isFetching: positionOptionsIsFetching,
    totalPages: positionOptionsTotalPages,
    pageSize: positionOptionsPageSize,
    pageIndex: positionOptionsPageIndex,
  } = usePositionOptions();
  const companyT = useTranslations(NS_COMPANY);
  const commonT = useTranslations(NS_COMMON);

  const { filters, onGetEmployees, pageSize, onInviteEmployee } =
    useEmployees();

  const [isShow, onShow, onHide] = useToggle();
  const [formStage, setFormStage] = useState<1 | 2>(1);
  const [employeeTypeToAdd, setEmployeeTypeToAdd] = useState<EmployeeType>(
    EmployeeType.EMPLOYEE,
  );

  const pathname = usePathname();
  const { push } = useRouter();
  const { user } = useAuth();


  const [queries, setQueries] = useState<Params>({});
  const [filterField, setFilterField] = useState("email");

  const paymentOptions = useMemo(
    () =>
      PAYMENT_OPTIONS.map((item) => ({ ...item, label: companyT(item.label) })),
    [companyT],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeQueries = (name: string, value: any) => {
    setQueries((prevQueries) => ({ ...prevQueries, [name]: value }));
  };

  const onSearch = () => {
    const q = { ...queries, fullname: queries["email"] };
    const path = getPath(pathname, q);
    push(path);

    // onGetEmployees({ ...queries, pageIndex: 1, pageSize });
  };

  const onClear = () => {
    const newQueries = { pageIndex: 1, pageSize };
    const path = getPath(pathname, newQueries);
    push(path);
    onGetEmployees({ ...newQueries });
  };

  const onRefresh = () => {
    onGetEmployees({ ...filters, pageIndex: 1, pageSize });
  };

  const onEndReached = () => {
    if (
      positionOptionsIsFetching ||
      (positionOptionsTotalPages &&
        positionOptionsPageIndex >= positionOptionsTotalPages)
    )
      return;
    onGetOptions({
      pageSize: positionOptionsPageSize,
      pageIndex: positionOptionsPageIndex + 1,
    });
  };

  useEffect(() => {
    onGetOptions({ pageIndex: 1, pageSize: 20 });
  }, [onGetOptions]);

  useEffect(() => {
    setQueries(filters);
  }, [filters]);

  return (
    <>
      <Stack
        direction="column"
        alignItems={{ md: "center" }}
        justifyContent="space-between"
        spacing={{ xs: 1, md: 1 }}
        px={{ xs: 0, md: 3 }}
        pt={2}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          spacing={{ xs: 2, md: 0 }}
        >
          {tabSwitcher}
            {(user?.roles.includes(Permission.AM)) && (
              <Button
                onClick={onShow}
                startIcon={<AddCircleIcon />}
                size="small"
                variant="primary"
                sx={{ height: 32, px: ({ spacing }) => `${spacing(2)}!important` }}
              >
                {commonT("createNew")}
              </Button>
            )}
        </Stack>

        <Stack
          direction="row"
          spacing={3}
          py={{ xs: 1.25, md: 0.5, lg: 1.25 }}
          px={{ md: 1, lg: 2 }}
          borderRadius={1}
          width={{ xs: "100%", md: undefined }}
          justifyContent="flex-start"
          alignItems="center"
          overflow="auto"
          minWidth={{ md: "fit-content" }}
        >
          <Search
            placeholder={commonT("searchBy", { name: "email or name" })}
            name={"email"}
            onChange={onChangeQueries}
            value={queries["email"]}
            sx={{
              width: 300,
              minWidth: 200,
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch();
              }
            }}
          />
          <Dropdown
            placeholder={commonT("position")}
            options={options}
            name="position"
            onChange={onChangeQueries}
            value={queries?.position}
            pending={positionOptionsIsFetching}
            onEndReached={onEndReached}
          />
          {/* <Dropdown
            placeholder={commonT("status")}
            options={paymentOptions}
            name="status"
            onChange={onChangeQueries}
            value={Number(queries?.status)}
          /> */}
          <StatusDropdown
              value={Number(queries?.status)}
              onChange={(value) => onChangeQueries("status", value)}
            />
          <Button size="small" onClick={onSearch} variant="secondaryOutlined">
            {commonT("search")}
          </Button>
          {/* <Stack direction="row" alignItems="center" spacing={3}>
            <Button size="small" onClick={onSearch} variant="secondary">
              {commonT("search")}
            </Button>
            <Refresh onClick={onRefresh} />
            {!!Object.keys(queries).length && <Clear onClick={onClear} />}
          </Stack> */}
        </Stack>
        <Button
          size="small"
          sx={{ height: 40, display: { md: "none" }, width: "fit-content" }}
          onClick={onSearch}
          variant="secondary"
        >
          {commonT("search")}
        </Button>
      </Stack>

      {isShow ? (
        formStage === 2 ? (
          <EmployeeCompanyForm
            open={isShow}
            onClose={() => {
              onHide();
              setFormStage(1);
            }}
            typeEmployee={employeeTypeToAdd}
            type={DataAction.CREATE}
            initialValues={INITIAL_VALUES}
            onSubmit={onInviteEmployee}
          />
        ) : (
          <EmployeeTypeForm
            open={isShow && formStage === 1}
            onClose={() => {
              onHide();
              setFormStage(1);
            }}
            onSubmit={(type: EmployeeType) => {
              setEmployeeTypeToAdd(type);
              setFormStage(2);
            }}
            options={[
              {
                label: companyT("employees.employee"),
                value: EmployeeType.EMPLOYEE,
              },
              {
                label: companyT("employees.client"),
                value: EmployeeType.CLIENT,
              },
              {
                label: companyT("employees.contractor"),
                value: EmployeeType.CONTRACTOR,
              },
              {
                label: companyT("employees.joinRequest"),
                value: EmployeeType.JOIN_REQUEST,
              }
            ]}
          />
        )
      ) : (
        <></>
      )}
    </>
  );
};

export default memo(Actions);

export const PAYMENT_OPTIONS = [
  { label: TEXT_STATUS[1], value: PayStatus.ACTIVE },
  { label: TEXT_STATUS[2], value: PayStatus.UNPAID },
  { label: TEXT_STATUS[3], value: PayStatus.PENDING },
];

const INITIAL_VALUES = {
  email: "",
  position: "",
  client: "",
  permission: Permission.ST,
};
