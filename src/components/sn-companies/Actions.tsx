"use client";

import { memo, useEffect, useState, useMemo } from "react";
import { Stack } from "@mui/material";
import { Button, Text } from "components/shared";
import { Clear, Date, Dropdown, Refresh, Search } from "components/Filters";
import { formatNumber, getPath } from "utils/index";
import { usePathname, useRouter } from "next-intl/client";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { CompanyStatus } from "store/company/actions";
import { TEXT_PAY_STATUS, TEXT_STATUS } from "./components/helpers";
import { useCompanies } from "store/manager/selectors";
import { useTranslations } from "next-intl";
import { DATE_FORMAT_HYPHEN, NS_COMMON, NS_MANAGER } from "constant/index";
import { PayStatus } from "constant/enums";
import useBreakpoint from "hooks/useBreakpoint";

const Actions = () => {
  const { filters, onGetCompanies, pageSize, statistic } = useCompanies();
  const commonT = useTranslations(NS_COMMON);
  const managerT = useTranslations(NS_MANAGER);
  const pathname = usePathname();
  const { push } = useRouter();

  const { isMdSmaller } = useBreakpoint();
  const [queries, setQueries] = useState<Params>({});

  const paymentOptions = useMemo(
    () =>
      PAYMENT_OPTIONS.map((item) => ({ ...item, label: commonT(item.label) })),
    [commonT],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeQueries = (name: string, value: any) => {
    if (name === "status") {
      const addQueries = {
        status: typeof value === "number" ? value : undefined,
        is_approve: typeof value === "string" ? value : undefined,
      };
      setQueries((prevQueries) => ({ ...prevQueries, ...addQueries }));
    } else {
      setQueries((prevQueries) => ({ ...prevQueries, [name]: value }));
    }
  };

  const onSearch = () => {
    const path = getPath(pathname, queries);
    push(path);

    onGetCompanies({ ...queries, pageIndex: 1, pageSize });
  };

  const onClear = () => {
    const newQueries = { pageIndex: 1, pageSize };
    const path = getPath(pathname, newQueries);
    push(path);
    onGetCompanies(newQueries);
  };

  const onRefresh = () => {
    onGetCompanies({ ...filters, pageIndex: 1, pageSize });
  };

  useEffect(() => {
    setQueries(filters);
  }, [filters]);

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      alignItems={{ xs: "flex-start", md: "center" }}
      justifyContent="space-between"
      spacing={{ xs: 2, md: 3 }}
      px={{ md: 3 }}
      pt={{ md: 1.5 }}
      pb={1.5}
    >
      {isMdSmaller ? (
        <Text variant="h4">{managerT("companyList.accountList")}</Text>
      ) : (
        <Stack spacing={1} width="fit-content">
          <Text variant="h6" color="grey.400" whiteSpace="nowrap">
            {managerT("companyList.staffPaid")}:
            <Text
              component="span"
              variant="inherit"
              color="success.main"
              ml={0.5}
            >
              {formatNumber(statistic?.total_company_paid)}
            </Text>
          </Text>
          <Text variant="h6" color="grey.400" whiteSpace="nowrap">
            {managerT("companyList.totalStaff")}:
            <Text
              component="span"
              variant="inherit"
              color="text.primary"
              ml={0.5}
            >
              {formatNumber(statistic?.total_company)}
            </Text>
          </Text>
        </Stack>
      )}

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
          onEnter={(name, value) => {
            onChangeQueries(name, value);
            onSearch();
          }}
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
          value={
            queries?.status ? Number(queries?.status) : queries?.is_approve
          }
        />
        <Button
          size="small"
          onClick={onSearch}
          variant="secondary"
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          {commonT("search")}
        </Button>
        {/* <Refresh onClick={onRefresh} /> */}
        {/* {!!Object.keys(queries).length && <Clear onClick={onClear} />} */}
      </Stack>

      <Button
        size="small"
        onClick={onSearch}
        variant="secondary"
        sx={{ display: { md: "none" } }}
      >
        {commonT("search")}
      </Button>
      <Stack
        direction="row"
        spacing={1}
        width="fit-content"
        display={{ md: "none" }}
      >
        <Text variant="h6" color="grey.400" whiteSpace="nowrap">
          {managerT("companyList.staffPaid")}:
          <Text
            component="span"
            variant="inherit"
            color="success.main"
            ml={0.5}
          >
            {formatNumber(statistic?.total_company_paid)}
          </Text>
        </Text>
        <Text variant="h6" color="grey.400" whiteSpace="nowrap">
          {managerT("companyList.totalStaff")}:
          <Text
            component="span"
            variant="inherit"
            color="text.primary"
            ml={0.5}
          >
            {formatNumber(statistic?.total_company)}
          </Text>
        </Text>
      </Stack>
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
