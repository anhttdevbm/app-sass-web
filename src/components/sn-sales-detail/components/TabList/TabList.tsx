"use client";
import useTheme from "hooks/useTheme";
import Link from "components/Link";
import {
  DATE_FORMAT_HYPHEN,
  DATE_FORMAT_SLASH,
  DATE_LOCALE_FORMAT,
  NS_SALES,
} from "constant/index";
import { useTranslations } from "next-intl";
import React, { memo, useCallback, useMemo } from "react";
import { getPath } from "utils/index";
import { Stack, Tab, Tabs } from "@mui/material";
import { Date, Dropdown } from "components/Filters";
import moment from "moment";
import { useSaleDetail, useSales } from "store/sales/selectors";
import Assign from "../Assign";
import { Controller, useFormContext, useWatch } from "react-hook-form";

export enum SALES_DETAIL_TAB {
  FEED = "feed",
  SERVICE = "service",
}
const TABS = [
  {
    label: "detail.tab.feed",
    value: SALES_DETAIL_TAB.FEED,
  },
  {
    label: "detail.tab.service",
    value: SALES_DETAIL_TAB.SERVICE,
  },
];

type TabItemProps = {
  href?: string;
  label: string;
  isActive: boolean;
  value: SALES_DETAIL_TAB;
};

type TabListProps = {
  value: SALES_DETAIL_TAB;
  onChange: (e: React.SyntheticEvent, newTab: SALES_DETAIL_TAB) => void;
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `  -tabpanel-${index}`,
  };
}

const TabItem = (props: TabItemProps) => {
  const { href = "", value, label, isActive, ...rest } = props;
  const salesT = useTranslations(NS_SALES);
  const { isDarkMode, palette } = useTheme();

  return (
    <Tab
      href={href}
      value={value}
      label={salesT(label)}
      {...rest}
      sx={{
        minWidth: 120,
        height: 40,
        bgcolor: isActive
          ? isDarkMode
            ? "grey.50"
            : "primary.light"
          : "transparent",
        "&:hover": {
          bgcolor: isDarkMode ? "grey.50" : "primary.light",
        },
        px: { xs: 2, sm: 3.5 },
        borderRadius: 1,
        color: isDarkMode ? palette.text.secondary : palette.grey[300],
        "&.Mui-selected": {
          color: isDarkMode ? palette.text.secondary : palette.text?.primary,
        },
      }}
    />
  );
};

const TabList = ({ value, onChange }: TabListProps) => {
  const { saleDetail } = useSaleDetail();
  const { onUpdateDeal } = useSales();

  const { control, setValue, getValues } = useFormContext();

  const members = useWatch({ control, name: "members" });

  const onAssign = (name, assignees) => {
    setValue(name, assignees);
    const newAssignees = assignees.filter(
      (item) => item.id !== saleDetail?.owner?.id,
    );
    onUpdateDeal({ id: getValues("id"), [name]: [...newAssignees] });
  };

  return (
    <Stack
      direction={{
        xs: "column",
        sm: "row",
      }}
      justifyContent="space-between"
      alignItems={{
        xs: "flex-start",
        sm: "center",
      }}
      sx={{
        padding: { xs: 2, sm: 0 },
        borderBottom: "1px solid",
        borderColor: "grey.100",
      }}
      gap={2}
    >
      <Tabs
        value={value}
        onChange={onChange}
        TabIndicatorProps={{
          sx: {
            bgcolor: "transparent",
          },
        }}
      >
        {TABS.map((tab) => (
          <TabItem
            value={tab.value}
            label={tab.label}
            isActive={tab.value === value}
            key={`sale-detail-tab-${tab.value}`}
          />
        ))}
      </Tabs>
      <Stack
        direction={{
          xs: "row-reverse",
          sm: "row",
        }}
        sx={{
          [`& .react-datepicker-popper`]: {
            zIndex: 9999,
          },
        }}
        alignItems="center"
        spacing={3}
      >
        <Controller
          name="start_date"
          control={control}
          defaultValue={saleDetail?.start_date || moment().toDate()}
          render={({ field }) => {
            const { onChange, ...rest } = field;
            const onChangeDate = (e, value) => {
              onChange(value);
              onUpdateDeal({ id: getValues("id"), start_date: value });
            };
            return (
              <Date
                label="Start Date"
                format={DATE_FORMAT_SLASH}
                onChange={onChangeDate}
                {...rest}
              />
            );
          }}
        />
        <Stack direction="row" gap={1} alignItems="center">
          {/* {avatarList?.length === 0 ||
            (true && (
              <Text variant="body2" sx={{ cursor: "pointer" }}>
                Assign
              </Text>
            ))}
          <PlusIcon />

          <Dropdown
            name="assign"
            onChange={() => console.log("change here")}
            options={employeeOptions}
            placeholder="Assign"
            SelectProps={{
              value: [
                {
                  label: "Assign",
                  value: "Assign",
                },
              ],
              multiple: true,
            }} */}
          {/* /> */}
          <Controller
            name="members"
            control={control}
            defaultValue={members}
            render={({ field }) => {
              return <Assign onAssign={onAssign} {...field} />;
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default memo(TabList);
