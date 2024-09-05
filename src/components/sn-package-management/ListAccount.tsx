"use client";

import { TableRow } from "@mui/material";
import { CellProps } from "components/NewTable";
import { BodyCell, TableLayout } from "components/Table";
import { NS_PACKAGE_MANAGERMENT } from "constant/index";
import { useTranslations } from "next-intl";
import { memo, useMemo } from "react";
import styled from "styled-components";
import SearchPackageManagement from "./components/Search";

const Title = styled.span`
  font-size: 25px;
  font-weight: 600;
`;

const Count = styled.span`
  color: #0575e6;
`;

const ListAccount = () => {
  const packageT = useTranslations(NS_PACKAGE_MANAGERMENT);

  const desktopHeaderList: CellProps[] = useMemo(
    () => [
      { value: packageT("list.name"), width: "20%", align: "left" },
      { value: packageT("list.email"), width: "20%", align: "left" },
      { value: packageT("list.role"), width: "20%", align: "left" },
      { value: packageT("list.package"), width: "20%", align: "left" },
      { value: packageT("list.expiration"), width: "20%", align: "left" },
    ],
    [packageT],
  );

  const items = [
    {
      name: "Thư Nguyễn",
      email: "email@gmail.com",
      role: "Admin",
      package: "Standard",
      expirationDate: "19/07/2024",
    },
    {
      name: "Thư Nguyễn",
      email: "email@gmail.com",
      role: "Admin",
      package: "Standard",
      expirationDate: "19/07/2024",
    },
    {
      name: "Thư Nguyễn",
      email: "email@gmail.com",
      role: "admin",
      package: "standard",
      expirationDate: "19/07/2024",
    },
  ];

  return (
    <>
      <Title>
        {packageT("head.account")} <Count>(10)</Count>
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
            <BodyCell align="left">{item.name}</BodyCell>
            <BodyCell align="left">{item.email}</BodyCell>
            <BodyCell align="left">{item.role}</BodyCell>
            <BodyCell align="left">{item.package}</BodyCell>
            <BodyCell align="left">{item.expirationDate}</BodyCell>
          </TableRow>
        ))}
      </TableLayout>
    </>
  );
};

export default memo(ListAccount);
