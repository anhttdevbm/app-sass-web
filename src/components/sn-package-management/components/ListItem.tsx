"use client";

import { Box, TableRow, useMediaQuery } from "@mui/material";
import { CellProps } from "components/NewTable";
import { BodyCell, TableLayout } from "components/Table";
import { NS_PACKAGE_MANAGERMENT } from "constant/index";
import { useTranslations } from "next-intl";
import { memo, useMemo } from "react";
import SearchPackageManagement from "./Search";
import { Text } from "components/shared";

const ListItem = () => {
  const packageT = useTranslations(NS_PACKAGE_MANAGERMENT);
  const isMobile = useMediaQuery("(max-width:600px)");

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
      {!isMobile ? (
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
      ) : (
        items.map((item, index) => (
          <Box
            key={index}
            width="100%"
            sx={{
              padding: "16px",
              background: "#F9F8F8",
              borderRadius: "12px",
              marginBottom: "12px",
            }}
          >
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Text>{packageT("list.name")}</Text>
              <Text>{item.name}</Text>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Text>{packageT("list.email")}</Text>
              <Text>{item.role}</Text>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Text>{packageT("list.role")}</Text>
              <Text>{item.package}</Text>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Text>{packageT("list.package")}</Text>
              <Text>{item.renewalDate ?? "0"}</Text>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Text>{packageT("list.expiration")}</Text>
              <Text>{item.expirationDate}</Text>
            </Box>
          </Box>
        ))
      )}
    </>
  );
};

export default memo(ListItem);
