"use client";

import { memo, useMemo } from "react";
import { Stack, StackProps } from "@mui/material";
import { BarChart, DoughnutChart } from "./components";
import { Text } from "components/shared";
import { Dropdown } from "components/Filters";
import { useAuth } from "store/app/selectors";
import { Permission } from "constant/enums";

type ChartStatisticProps = {};

const ChartStatistic = (props: ChartStatisticProps) => {
  const { user } = useAuth();

  const isSARole = useMemo(
    () => user?.roles?.includes(Permission.SA),
    [user?.roles],
  );

  if (!isSARole) return null;

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
      <Layout
        flex={2}
        label="Overview"
        labelChildren={
          <Dropdown
            onChange={() => {
              //
            }}
            value={2023}
            hasAll={false}
            name="time"
            options={[{ label: "2023", value: 2023 }]}
          />
        }
      >
        <BarChart />
      </Layout>
      <Layout flex={1} label="Customers">
        <DoughnutChart />
      </Layout>
    </Stack>
  );
};

export default memo(ChartStatistic);

const Layout = (
  props: StackProps & { label: string; labelChildren?: React.ReactNode },
) => {
  const { label, children, labelChildren, ...rest } = props;

  return (
    <Stack
      p={{ xs: 1.5, md: 3 }}
      bgcolor="background.paper"
      borderRadius={4}
      {...rest}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Text variant="h4" color="text.primary">
          {label}
        </Text>
        {labelChildren}
      </Stack>
      {children}
    </Stack>
  );
};
