"use client";

import { useParams } from "next/navigation";
import {
  TBudgetFeeds,
  useBudgetGetFeedQuery,
} from "../../../queries/budgeting/get-feed";
import { useEffect, useState } from "react";
import { TBudget } from "store/project/budget/action";
import { Box, Stack } from "@mui/material";
import Avatar from "components/Avatar";
import { Text } from "components/shared";
import { useTranslations } from "next-intl";
import {
  DATE_FORMAT_HYPHEN,
  DATE_LOCALE_FORMAT,
  NS_BUDGETING,
  SHORT_TIME_FORMAT,
} from "constant/index";
import { formatDate } from "utils/index";
import { BadgeCustom } from "components/sn-budgeting/BadgeCustom";
import moment from "moment";

const FeedAction: Record<string, string> = {
  CREATE_BUDGET: "create",
  CREATE_BUDGET_SERVICE: "create_service",
};

export const Feed = ({ budget }: { budget: TBudget }) => {
  const [feeds, setFeeds] = useState<TBudgetFeeds>([]);
  const { id: budgetId } = useParams();
  const budgetFeedQuery = useBudgetGetFeedQuery(String(budgetId));
  const budgetT = useTranslations(NS_BUDGETING);

  useEffect(() => {
    if (budgetFeedQuery) {
      setFeeds(budgetFeedQuery.data.docs);
    }
  }, [budgetFeedQuery]);

  return (
    <Stack p="30px">
      {feeds.map((feed, index) => {
        const create_time = moment(feed.created_time).format("YYYY-MM-DD");
        const now = moment().format("YYYY-MM-DD");
        const isSameDay = moment(create_time).isSame(now);
        return (
          <Box key={`budget-feed-${index}`}>
            <Stack
              direction="row"
              alignItems="start"
              display="inline-flex"
              sx={{
                pb: 1,
                mb: 2,
                ...(index + 1 < feeds.length && {
                  borderBottom: "2px solid",
                  borderColor: "grey.200",
                }),
              }}
            >
              <Avatar size={40} src={budget?.created_by?.avatar?.link || ""} />
              <Stack px="10px">
                <Text fontSize="16px" fontWeight="bold" mb="5px">
                  {budgetT(`actionStatus.${FeedAction[feed.action]}`)}
                </Text>
                <Stack direction="row" gap={1} alignItems="center" mb="5px">
                  <Text>Created</Text>
                  <BadgeCustom text={feed.budget_id.created_by.fullname} />
                </Stack>
                <Stack direction="row" gap={1} alignItems="center" mb="5px">
                  <Text>Responsible set to</Text>
                  <BadgeCustom text={feed.budget_id.owner.fullname} />
                </Stack>
                <Stack direction="row" gap={1} alignItems="center" mb="5px">
                  <Text>Currency set to</Text>
                  <BadgeCustom
                    text={feed.data.currency ?? feed.budget_id.currency}
                  />
                </Stack>
                <Stack direction="row" gap={1} alignItems="center" mb="5px">
                  <Text>Company set to</Text>
                  <BadgeCustom text={feed.budget_id.company} />
                </Stack>
                <Stack direction="row" gap={1} alignItems="center" mb="5px">
                  <Text>Deal type set to</Text>
                  <BadgeCustom text={"Client"} />
                </Stack>
                <Stack direction="row" gap={1} alignItems="center" mb="5px">
                  <Text>Start date set to</Text>
                  <BadgeCustom
                    text={formatDate(feed.data.start_date, DATE_LOCALE_FORMAT)}
                  />
                </Stack>
                <Stack direction="row" gap={1} alignItems="center" mb="5px">
                  <Text>End date set to</Text>
                  <BadgeCustom
                    text={formatDate(
                      feed.data.end_date ?? feed.budget_id.end_date,
                      DATE_LOCALE_FORMAT,
                    )}
                  />
                </Stack>
              </Stack>
              <Stack textAlign="center">
                <Text sx={{ color: "gray.300", fontSize: "14px" }}>
                  {formatDate(feed.created_time, SHORT_TIME_FORMAT)}
                </Text>
                {!isSameDay && (
                  <Text sx={{ color: "gray.300", fontSize: "14px" }}>
                    {formatDate(feed.created_time, DATE_FORMAT_HYPHEN)}
                  </Text>
                )}
              </Stack>
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
};
