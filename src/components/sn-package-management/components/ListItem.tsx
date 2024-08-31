"use client";

import { TableRow } from "@mui/material";
import { CellProps } from "components/NewTable";
import { BodyCell, TableLayout } from "components/Table";
import { NS_PACKAGE_MANAGERMENT } from "constant/index";
import { useTranslations } from "next-intl";
import { memo, useMemo } from "react";
import styled from "styled-components";
import SearchPackageManagement from "./Search";

const ListItem = () => {
  const packageT = useTranslations(NS_PACKAGE_MANAGERMENT);

  const headerList: CellProps[] = useMemo(
    () => [
      { value: packageT("list.name"), width: "30%", align: "left" },
      { value: packageT("list.role"), width: "15%", align: "left" },
      { value: packageT("list.package"), width: "15%", align: "left" },
      { value: packageT("list.renewalDate"), width: "20%", align: "left" },
      { value: packageT("list.expiration"), width: "20%", align: "left" },
    ],
    [packageT],
  );

  const items = [
    {
      name: "Thư Nguyễn",
      renewalDate: "email@gmail.com",
      role: "Admin",
      package: "Standard",
      expirationDate: "19/07/2024",
    },
    {
      name: "Thư Nguyễn",
      renewalDate: "email@gmail.com",
      role: "Admin",
      package: "Standard",
      expirationDate: "19/07/2024",
    },
    {
      name: "Thư Nguyễn",
      renewalDate: "email@gmail.com",
      role: "admin",
      package: "standard",
      expirationDate: "19/07/2024",
    },
  ];

  return (
    <>
      <SearchPackageManagement placeholder={packageT("placeholder.search")} />
      <TableLayout
        headerList={headerList}
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
            <BodyCell align="left">{item.role}</BodyCell>
            <BodyCell align="left">{item.package}</BodyCell>
            <BodyCell align="left">{item.renewalDate}</BodyCell>
            <BodyCell align="left">{item.expirationDate}</BodyCell>
          </TableRow>
        ))}
      </TableLayout>
    </>
  );
};

export default memo(ListItem);
