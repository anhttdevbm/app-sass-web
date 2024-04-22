"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { Stack } from "@mui/material";
import { Button, Text } from "components/shared";
import { Clear, Date, Dropdown, Refresh, Search } from "components/Filters";
import { formatNumber, getPath } from "utils/index";
import { usePathname, useRouter } from "next-intl/client";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { TEXT_PAY_STATUS, TEXT_STATUS } from "./components/helpers";
import { useCompany, useEmployeesOfCompany } from "store/manager/selectors";
import { DATE_FORMAT_HYPHEN, NS_COMMON, NS_MANAGER } from "constant/index";
import { useTranslations } from "next-intl";
import { PayStatus } from "constant/enums";
import { CompanyStatus } from "store/manager/actions";

const Actions = () => {
  const { filters, onGetEmployees, pageSize, statistic } =
    useEmployeesOfCompany();
  const commonT = useTranslations(NS_COMMON);
  const managerT = useTranslations(NS_MANAGER);

  const pathname = usePathname();
  const { push } = useRouter();
  const { item } = useCompany();

  const companyCode = useMemo(() => item?.code, [item?.code]);

  const [queries, setQueries] = useState<Params>({});

  const paymentOptions = useMemo(
    () =>
      PAYMENT_OPTIONS.map((item) => ({ ...item, label: commonT(item.label) })),
    [commonT],
  );

  const queriesIgnoreCompany = useMemo(() => {
    const _queriesIgnoreCompany = { ...queries };
    delete _queriesIgnoreCompany["company"];
    return _queriesIgnoreCompany;
  }, [queries]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeQueries = (name: string, value: any) => {
    if (name === "status") {
      const addQueries = {
        status: typeof value === "number" ? value : undefined,
        approve: typeof value === "string" ? value : undefined,
      };
      setQueries((prevQueries) => ({ ...prevQueries, ...addQueries }));
    } else {
      setQueries((prevQueries) => ({ ...prevQueries, [name]: value }));
    }
  };

  const onSearch = () => {
    if (!companyCode) return;
    const path = getPath(pathname, queriesIgnoreCompany);
    push(path);

    onGetEmployees(companyCode, { ...queries, pageIndex: 1, pageSize });
  };

  const onClear = () => {
    if (!companyCode) return;
    const newQueries = { pageIndex: 1, pageSize };
    const path = getPath(pathname, newQueries);
    push(path);
    onGetEmployees(companyCode, newQueries);
  };

  const onRefresh = () => {
    if (!companyCode) return;
    onGetEmployees(companyCode, { ...filters, pageIndex: 1, pageSize });
  };

  useEffect(() => {
    if (!companyCode) return;
    setQueries(filters);
  }, [filters, companyCode]);

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      alignItems={{ md: "center" }}
      justifyContent="space-between"
      spacing={{ xs: 2, md: 3 }}
      px={{ md: 3 }}
      pt={{ md: 3 }}
      pb={2}
    >
      <Stack
        direction={{ xs: "row", md: "column" }}
        spacing={{ xs: 3, md: 1 }}
        width="fit-content"
      >
        <Text variant="h6" color="grey.400" whiteSpace="nowrap">
          {managerT("employeeList.staffPaid")}:
          <Text
            component="span"
            variant="inherit"
            color="success.main"
            ml={0.5}
          >
            {formatNumber(statistic?.total_user_paid)}
          </Text>
        </Text>
        <Text variant="h6" color="grey.400" whiteSpace="nowrap">
          {managerT("employeeList.staffUnpaid")}:
          <Text
            component="span"
            variant="inherit"
            color="text.primary"
            ml={0.5}
          >
            {formatNumber(statistic?.total_user_un_paid)}
          </Text>
        </Text>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        spacing={{ xs: 2, md: 3 }}
        py={{ md: 1.25 }}
        px={{ md: 2 }}
        borderRadius={1}
        width={{ xs: "100%", md: "fit-content" }}
        border={{ md: "1px solid" }}
        borderColor={{ md: "grey.100" }}
        justifyContent={{ xs: "flex-start", md: "flex-end" }}
        overflow="auto"
        maxWidth="100%"
      >
        <Search
          placeholder={commonT("searchBy", { name: "email" })}
          name="email"
          onChange={onChangeQueries}
          value={queries?.email}
          sx={{ minWidth: "fit-content", height: { xs: 46, md: 32 } }}
          rootSx={{ height: { xs: 46, md: 32 } }}
        />
        <Date
          label={commonT("creationDate")}
          name="created_time"
          onChange={onChangeQueries}
          value={queries?.created_time}
          format={DATE_FORMAT_HYPHEN}
        />
        <Dropdown
          placeholder={commonT("status")}
          options={paymentOptions}
          name="status"
          onChange={onChangeQueries}
          value={queries?.status ? Number(queries?.status) : queries?.approve}
        />
        <Button
          size="small"
          onClick={onSearch}
          variant="secondary"
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          {commonT("search")}
        </Button>
        {/* <Refresh onClick={onRefresh} />
          {!!Object.keys(queriesIgnoreCompany).length && (
            <Clear onClick={onClear} />
          )} */}
      </Stack>
      <Button
        size="small"
        onClick={onSearch}
        variant="secondary"
        sx={{ display: { md: "none" }, width: "fit-content" }}
      >
        {commonT("search")}
      </Button>
    </Stack>
  );
};

export default memo(Actions);

const PAYMENT_OPTIONS = [
  { label: TEXT_PAY_STATUS[PayStatus.PAID], value: PayStatus.PAID },
  { label: TEXT_PAY_STATUS[PayStatus.UNPAID], value: PayStatus.UNPAID },
  { label: TEXT_PAY_STATUS[PayStatus.WAITING], value: PayStatus.WAITING },
  { label: TEXT_STATUS[CompanyStatus.APPROVE], value: "true" },
  { label: TEXT_STATUS[CompanyStatus.REJECT], value: "false" },
];
