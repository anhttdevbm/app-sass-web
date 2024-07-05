"use client";

import { memo, useMemo } from "react";
import { Stack, TableRow } from "@mui/material";
import { Text } from "components/shared";
import Link from "components/Link";
import { HOME_PATH } from "constant/paths";
import { BodyCell, CellProps, TableLayout } from "components/Table";
import { formatDate, formatNumber } from "utils/index";
import useTheme from "hooks/useTheme";
import { Permission } from "constant/enums";
import { useAuth } from "store/app/selectors";

const Transactions = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  const isSARole = useMemo(
    () => user?.roles?.includes(Permission.SA),
    [user?.roles],
  );

  if (!isSARole) return null;

  return (
    <Stack
      borderRadius={7.5}
      boxShadow={isDarkMode ? "none" : "0px 10px 60px rgba(226, 236, 249, 0.5)"}
      bgcolor="background.paper"
      pt={4.375}
      pb={3.5}
      px={{ xs: 1.5, sm: 3, lg: 6 }}
      spacing={4}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Text variant="h4">Recent transactions</Text>
        <Link href={HOME_PATH} underline="none">
          <Text variant="h6" color="primary">
            See all
          </Text>
        </Link>
      </Stack>
      <TableLayout
        headerList={HEADER_LIST}
        containerHeaderProps={{ sx: { maxHeight: 0, minHeight: 0, height: 0 } }}
        headerProps={{ sx: { maxHeight: 0, minHeight: 0, height: 0 } }}
      >
        <TableRow>
          <BodyCell>{formatDate("2023-06-01T16:53:39.685Z")}</BodyCell>
          <BodyCell>{formatDate("2023-06-01T16:53:39.685Z")}</BodyCell>
          <BodyCell>AI software nelson</BodyCell>
          <BodyCell>{formatNumber(12)}</BodyCell>
          <BodyCell>{formatNumber(99.9)}</BodyCell>
        </TableRow>
        <TableRow>
          <BodyCell>{formatDate("2023-06-01T16:53:39.685Z")}</BodyCell>
          <BodyCell>{formatDate("2023-06-01T16:53:39.685Z")}</BodyCell>
          <BodyCell>AI software nelson</BodyCell>
          <BodyCell>{formatNumber(12)}</BodyCell>
          <BodyCell>{formatNumber(99.9)}</BodyCell>
        </TableRow>
        <TableRow>
          <BodyCell>{formatDate("2023-06-01T16:53:39.685Z")}</BodyCell>
          <BodyCell>{formatDate("2023-06-01T16:53:39.685Z")}</BodyCell>
          <BodyCell>AI software nelson</BodyCell>
          <BodyCell>{formatNumber(12)}</BodyCell>
          <BodyCell>{formatNumber(99.9)}</BodyCell>
        </TableRow>
      </TableLayout>
    </Stack>
  );
};

export default memo(Transactions);

const HEADER_LIST: CellProps[] = [
  { value: "", width: "15%" },
  { value: "", width: "15%" },
  { value: "", width: "30%", align: "left" },
  { value: "", width: "20%" },
  { value: "", width: "20%" },
];
