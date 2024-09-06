"use client";

import { TableRow } from "@mui/material";
import { CellProps } from "components/NewTable";
import { BodyCell, TableLayout } from "components/Table";
import { NS_PACKAGE_MANAGERMENT } from "constant/index";
import { useTranslations } from "next-intl";
import { memo, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import SearchPackageManagement from "./components/Search";
import { usePayment } from "store/payment/selectors";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "store/configureStore";
import { useSelector } from "react-redux";
import { getListAccounts } from "store/payment/actions";

const Title = styled.span`
  font-size: 25px;
  font-weight: 600;
`;

const Count = styled.span`
  color: #0575e6;
`;

const ListAccount = () => {
  const packageT = useTranslations(NS_PACKAGE_MANAGERMENT);
  const dispatch = useDispatch<AppDispatch>();

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const {
    data: accounts,
    total,
    loading,
    error,
  } = useSelector((state: RootState) => state.payment.accounts);

  useEffect(() => {
    dispatch(getListAccounts({ page, size }));
  }, [dispatch, page, size]);

  const desktopHeaderList: CellProps[] = useMemo(
    () => [
      { value: packageT("list.name"), width: "20%", align: "center" },
      { value: packageT("list.email"), width: "20%", align: "center" },
      { value: packageT("list.role"), width: "20%", align: "center" },
      { value: packageT("list.package"), width: "20%", align: "center" },
      { value: packageT("list.expiration"), width: "20%", align: "center" },
    ],
    [packageT],
  );

  return (
    <>
      <Title>
        {packageT("head.account")} <Count>({total})</Count>
      </Title>
      <SearchPackageManagement placeholder={packageT("placeholder.search")} />
      <TableLayout
        headerList={desktopHeaderList}
        headerProps={{
          style: {
            padding: "16px",
            backgroundColor: "#d9f0fd",
          },
        }}
        px={3}
        style={{ padding: 0 }}
      >
        {accounts.map((item, index) => (
          <TableRow key={index}>
            <BodyCell>{item.fullname}</BodyCell>
            <BodyCell>{item.email}</BodyCell>
            <BodyCell>{item.roles}</BodyCell>
            <BodyCell>{item.packageName ?? "0"}</BodyCell>
            <BodyCell>{item.expirationDate}</BodyCell>
          </TableRow>
        ))}
      </TableLayout>
    </>
  );
};

export default memo(ListAccount);
