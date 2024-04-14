"use client";
import { memo, useMemo, useEffect, useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import { usePathname, useRouter } from "next-intl/client";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useTranslations } from "next-intl";

import { NS_COMPANY, NS_COMMON } from "constant/index";
import { DataAction, EmployeeType, PayStatus } from "constant/enums";
import { NewButton as Button, Text } from "components/shared";
import { Dropdown, Search } from "components/NewFilters";
import { TEXT_STATUS } from "./helpers";
import useToggle from "hooks/useToggle";
import { getPath } from "utils/index";
import { useEmployees } from "store/company/selectors";
import { usePositionOptions } from "store/global/selectors";
import AddCircleIcon from "icons/AddCircleIcon";
import EmployeeCompanyForm from "./EmployeeCompanyForm";
import EmployeeTypeForm from "./EmployeeTypeForm";

const Actions = () => {
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

  const {
    filters,
    onGetEmployees,
    pageSize,
    onCreateEmployee,
  } = useEmployees();

  const [isShow, onShow, onHide] = useToggle();
  const [formStage, setFormStage] = useState<1 | 2>(1);
  const [employeeTypeToAdd, setEmployeeTypeToAdd] = useState<EmployeeType>(EmployeeType.EMPLOYEE);

  const pathname = usePathname();
  const { push } = useRouter();

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
        spacing={{ xs: 1, md: 3 }}
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
          <Text variant="h4">{companyT("employees.title")}</Text>
          <Button
            onClick={onShow}
            startIcon={<AddCircleIcon />}
            size="small"
            variant="primary"
            sx={{ height: 32, px: ({ spacing }) => `${spacing(2)}!important` }}
          >
            {commonT("createNew")}
          </Button>
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
          <Dropdown
            placeholder={commonT("status")}
            options={paymentOptions}
            name="status"
            onChange={onChangeQueries}
            value={Number(queries?.status)}
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

      {
        // 3 level nested condition, so if-else statements in IFFE instead of chained ternary operator
        (() => {
          if (isShow) {
            if (formStage === 2) {
              switch (employeeTypeToAdd) {
                case EmployeeType.EMPLOYEE:
                  return (
                    <EmployeeCompanyForm
                      open={isShow}
                      onClose={() => {
                        onHide();
                        setFormStage(1);
                      }}
                      type={DataAction.CREATE}
                      initialValues={INITIAL_VALUES}
                      onSubmit={onCreateEmployee}
                    />
                  );
                case EmployeeType.CLIENT:
                  return (
                    <EmployeeCompanyForm
                      open={isShow}
                      onClose={() => {
                        onHide();
                        setFormStage(1);
                      }}
                      type={DataAction.CREATE}
                      initialValues={INITIAL_VALUES}
                      onSubmit={onCreateEmployee}
                    />
                  );
                case EmployeeType.CONTRACTOR:
                  return (
                    <EmployeeCompanyForm
                      open={isShow}
                      onClose={() => {
                        onHide();
                        setFormStage(1);
                      }}
                      type={DataAction.CREATE}
                      initialValues={INITIAL_VALUES}
                      onSubmit={onCreateEmployee}
                    />
                  );
              }
            } else {
              return (
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
                    { label: "Employee", value: EmployeeType.EMPLOYEE },
                    { label: "Client", value: EmployeeType.CLIENT },
                    { label: "Contractor", value: EmployeeType.CONTRACTOR },
                  ]}
                />
              );
            }
          }
        })()
      }
    </>
  );
};

export default memo(Actions);

const PAYMENT_OPTIONS = [
  { label: TEXT_STATUS[1], value: PayStatus.PAID },
  { label: TEXT_STATUS[2], value: PayStatus.UNPAID },
  { label: TEXT_STATUS[3], value: PayStatus.WAITING },
];

const INITIAL_VALUES = {
  email: "",
  position: "",
};
