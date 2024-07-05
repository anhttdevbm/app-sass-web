"use client";

import { memo, useEffect, useMemo } from "react";
import { Stack, TableRow } from "@mui/material";
import { BodyCell, TableLayout } from "components/Table";
import { useLocale, useTranslations } from "next-intl";
import { DATE_FORMAT_SLASH, NS_PROJECT } from "constant/index";
import { useActivitiesOfProject } from "store/project/selectors";
import { Content, Time } from "./components";
import UserInfo from "components/UserInfo";
import { DEFAULT_RANGE_ACTIVITIES } from "store/project/reducer";
import useQueryParams from "hooks/useQueryParams";
import { useParams } from "next/navigation";
import { Text } from "components/shared";
import { getDate, addDays, getDay, format, parse } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { formatDate } from "utils/index";
import useBreakpoint from "hooks/useBreakpoint";

const START = parse(
  DEFAULT_RANGE_ACTIVITIES.start_date,
  DATE_FORMAT_SLASH,
  new Date(),
);
const SELECTED = "2023-07-01T02:37:49.149Z";

const ItemList = () => {
  const { items, isFetching, error, isIdle, onGetActivitiesOfProject } =
    useActivitiesOfProject();

  const { initQuery, isReady } = useQueryParams();
  const { isSmSmaller } = useBreakpoint();

  const params = useParams();
  const locale = useLocale();

  const projectId = useMemo(() => params.id, [params.id]) as string;

  const localeData = useMemo(() => (locale === "vi" ? vi : enUS), [locale]);

  const headerList = useMemo(() => {
    return DAYS.map((day, index) => {
      const isSelected =
        formatDate(SELECTED) ===
        formatDate(addDays(new Date(START), index).getTime());
      return {
        value: (
          <>
            <Text variant="h4" color={isSelected ? "primary.main" : "grey.400"}>
              {formatDay(START, index)}
            </Text>
            <Text variant="h6" color={isSelected ? "primary.main" : "grey.400"}>
              {localeData?.localize?.day(
                getDay(addDays(new Date(START), index)),
                {
                  width:
                    locale === "vi" || isSmSmaller ? "abbreviated" : "wide",
                },
              )}
            </Text>
          </>
        ),
      };
    });
  }, [locale, localeData?.localize, isSmSmaller]);

  useEffect(() => {
    if (!isReady || !projectId) return;
    onGetActivitiesOfProject(projectId, {
      ...DEFAULT_RANGE_ACTIVITIES,
      ...initQuery,
    });
  }, [initQuery, isReady, onGetActivitiesOfProject, projectId]);

  return (
    <TableLayout
      headerList={headerList}
      pending={isFetching}
      error={error as string}
      noData={!isIdle && items.length === 0}
    >
      {items.map((item, index) => (
        <TableRow key={item.id}>
          <BodyCell colSpan={headerList.length} sx={{ border: "none" }}>
            <Stack direction="row" flex={1} overflow="hidden" minHeight={90}>
              <Time
                value={item.created_time}
                topDivider={index !== 0}
                bottomDivider={index !== items.length - 1}
              />
              <Stack
                direction={{ xs: "column", md: "row" }}
                alignItems={{ md: "center" }}
                spacing={3}
                flex={1}
                p={2}
                ml={3}
                border="1px solid"
                borderColor="grey.100"
                borderRadius={1}
                my={1}
              >
                <UserInfo user={item.user} flex={1} />
                <Content action={item.action} note={item?.note} />
              </Stack>
            </Stack>
          </BodyCell>
        </TableRow>
      ))}
    </TableLayout>
  );
};

export default memo(ItemList);

const DAYS = [
  "detailActivities.monday",
  "detailActivities.tuesday",
  "detailActivities.wednesday",
  "detailActivities.thursday",
  "detailActivities.friday",
  "detailActivities.saturday",
  "detailActivities.sunday",
];

const formatDay = (value: string | Date, index: number) => {
  const date = getDate(addDays(new Date(value), index));
  return date < 10 ? `0${date}` : date;
};
