"use client";

import { TableRow } from "@mui/material";
import { CellProps } from "components/NewTable";
import { BodyCell, TableLayout } from "components/Table";
import { NS_PACKAGE_MANAGERMENT } from "constant/index";
import { useTranslations } from "next-intl";
import { memo, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import SearchPackageManagement from "./components/Search";
import TransactionDetail from "./modals/TransactionDetail";
import { Text } from "components/shared";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "store/configureStore";
import { useSelector } from "react-redux";
import { getAllTransaction } from "store/payment/actions";

const Title = styled.span`
  font-size: 25px;
  font-weight: 600;
`;

const Count = styled.span`
  color: #0575e6;
`;

const ListTransactionHistory = () => {
  const packageT = useTranslations(NS_PACKAGE_MANAGERMENT);
  const dispatch = useDispatch<AppDispatch>();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const {
    data: transactions,
    total,
    loading,
    error,
  } = useSelector((state: RootState) => state.payment.transactions);

  useEffect(() => {
    dispatch(getAllTransaction({ page, size }));
  }, [dispatch, page, size]);

  const desktopHeaderList: CellProps[] = useMemo(
    () => [
      { value: packageT("list.id"), width: "12.5%", align: "left" },
      { value: packageT("list.type"), width: "12.5%", align: "left" },
      { value: packageT("list.billingPlan"), width: "12.5%", align: "left" },
      { value: packageT("list.package"), width: "12.5%", align: "left" },
      { value: packageT("list.accountNumber"), width: "16.5%", align: "right" },
      { value: packageT("list.totalAmount"), width: "16.5%", align: "right" },
      { value: packageT("list.creationTime"), width: "16.5%", align: "left" },
    ],
    [packageT],
  );
  console.log(transactions, "transactions");
  const items = [
    {
      name: "Thư Nguyễn",
      email: "email@gmail.com",
      role: "Admin",
      package: "Standard",
      expirationDate: "19/07/2024",
      totalAmount: "$12",
      accountNumber: "5",
    },
    {
      name: "Thư Nguyễn",
      email: "email@gmail.com",
      role: "Admin",
      package: "Standard",
      expirationDate: "19/07/2024",
      totalAmount: "$12",
      accountNumber: "5",
    },
    {
      name: "Thư Nguyễn",
      email: "email@gmail.com",
      role: "admin",
      package: "standard",
      expirationDate: "19/07/2024",
      totalAmount: "$12",
      accountNumber: "5",
    },
    {
      name: "Thư Nguyễn",
      email: "email@gmail.com",
      role: "admin",
      package: "standard",
      expirationDate: "19/07/2024",
      totalAmount: "$12",
      accountNumber: "5",
    },
    {
      name: "Thư Nguyễn",
      email: "email@gmail.com",
      role: "admin",
      package: "standard",
      expirationDate: "19/07/2024",
      totalAmount: "$12",
      accountNumber: "5",
    },
  ];

  return (
    <>
      <Title>
        {packageT("head.transactionHistory")} <Count>(10)</Count>
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
        {items.map((item, index) => (
          <TableRow key={index}>
            <BodyCell align="left" onClick={() => setOpenModal(true)}>
              <Text
                sx={{
                  color: "#0575E6",
                }}
              >
                {item.name}
              </Text>
            </BodyCell>
            <BodyCell align="left">{item.email}</BodyCell>
            <BodyCell align="left">{item.email}</BodyCell>
            <BodyCell align="left">{item.package}</BodyCell>
            <BodyCell align="right">{item.accountNumber}</BodyCell>
            <BodyCell align="right" sx={{ fontWeight: 600 }}>
              {item.totalAmount}
            </BodyCell>
            <BodyCell align="left">{item.expirationDate}</BodyCell>
          </TableRow>
        ))}
      </TableLayout>
      <TransactionDetail open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
};

export default memo(ListTransactionHistory);
