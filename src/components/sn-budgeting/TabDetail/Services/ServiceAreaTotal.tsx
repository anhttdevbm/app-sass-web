/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Stack, Typography } from "@mui/material";
import { H6, PTag, ServiceBox } from "./ServiceUtil";
import { NS_BUDGETING } from "constant/index";
import { useTranslations } from "next-intl";
import { BILLING_CREATE_PATH } from "constant/paths";
import { useRouter } from "next-intl/client";
import { useParams } from "next/navigation";
import _ from "lodash";
import { useMemo } from "react";
import moment from "moment";
import useTheme from "hooks/useTheme";

interface Props {
  serviceData: any;
}

export const ServiceAreaTotal = ({ serviceData }: Props) => {
  const budgetT = useTranslations(NS_BUDGETING);
  const { push } = useRouter();
  const { id } = useParams();
  const { isDarkMode } = useTheme();

  const remainingTimeRate = useMemo(() => {
    return (
      (Number(_.get(serviceData, "remainingTime", 0)) /
        Number(_.get(serviceData, "estimatedTime", 0))) *
        100 || 0
    );
  }, [serviceData]);

  return (
    <Box
      sx={{
        position: "sticky !important",
        top: '170px', // header height
        background: isDarkMode ? "#313130" : "white",
        zIndex: 10,
      }}
    >
      <Stack gap={1} direction="row">
        <Box sx={{ flex: 1, "& .MuiStack-root": { height: "100%" } }}>
          <ServiceBox
            remaining={`${
              _.isEmpty(remainingTimeRate) ? 0 : remainingTimeRate
            }%`}
          >
            <Stack direction="row" justifyContent="space-between">
              <H6>{budgetT("tabService.totalArea.time.title")}</H6>
              <PTag>{moment().format("D MMM, YYYY")}</PTag>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <H6>{budgetT("tabService.totalArea.time.budgetedTime")}</H6>
              <PTag>00:00</PTag>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <H6>{budgetT("tabService.totalArea.time.billableTime")}</H6>
              <PTag>00:00</PTag>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <H6>{budgetT("tabService.totalArea.time.estimatedTime")}</H6>
              <PTag>{_.get(serviceData, "allTime", "00:00")}</PTag>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <H6>{budgetT("tabService.totalArea.time.workedTime")}</H6>
              <PTag>{_.get(serviceData, "allTimeUsed", "00:00")}</PTag>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <H6>
                {budgetT("tabService.totalArea.time.remainingTime")} (
                {_.isEmpty(remainingTimeRate) ? 0 : remainingTimeRate}%)
              </H6>
              <PTag>{_.get(serviceData, "remainingTime", "00:00")}</PTag>
            </Stack>
          </ServiceBox>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Stack direction="column" gap={1}>
            <ServiceBox remaining="20%">
              <Stack direction="row" justifyContent="space-between">
                <H6>{budgetT("tabService.totalArea.profit.title")}</H6>
                <PTag>{moment().format("D MMM, YYYY")}</PTag>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <H6>{budgetT("tabService.totalArea.profit.revenue")}</H6>
                <PTag>$0,00</PTag>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <H6>{budgetT("tabService.totalArea.profit.cost")}</H6>
                <PTag>$0,00</PTag>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <H6>{budgetT("tabService.totalArea.profit.profit")} (20%)</H6>
                <PTag>$0,00</PTag>
              </Stack>
            </ServiceBox>
            <ServiceBox remaining="50%">
              <Stack
                direction="row"
                justifyContent="space-between"
                width="100%"
              >
                <H6>{budgetT("tabService.totalArea.budget.title")}</H6>
                <PTag>{moment().format("D MMM, YYYY")}</PTag>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <H6>{budgetT("tabService.totalArea.budget.budgetTotal")}</H6>
                <PTag>
                  ${_.round(_.get(serviceData, "allBudgetTotal", 0), 2)}
                </PTag>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <H6>{budgetT("tabService.totalArea.budget.budgetUsed")}</H6>
                <PTag>${_.round(_.get(serviceData, "allBudgetUsed", 0))}</PTag>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <H6>
                  {budgetT("tabService.totalArea.budget.budgetRemaining")}
                </H6>
                <PTag>$0,00</PTag>
              </Stack>
            </ServiceBox>
          </Stack>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Stack
            direction="column"
            gap={1}
            sx={{ height: "100%", "& .MuiStack-root": { flexGrow: 1 } }}
          >
            <ServiceBox>
              <Stack
                justifyContent="space-between"
                height="100%"
                direction="row"
              >
                <H6>{budgetT("tabService.totalArea.invoicing.title")}</H6>
                <Typography
                  variant="h6"
                  sx={{
                    textTransform: "capitalize",
                    color: "#693dfb",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    push(BILLING_CREATE_PATH + `?budget=${id}`);
                  }}
                >
                  {budgetT("tabService.totalArea.invoicing.newInvoice")}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <H6>{budgetT("tabService.totalArea.invoicing.total")}</H6>
                <PTag>$5.880,00</PTag>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <H6>
                  {budgetT("tabService.totalArea.invoicing.invoiced")} (0%)
                </H6>
                <PTag>$0.00</PTag>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <H6>
                  {budgetT("tabService.totalArea.invoicing.forInvoicing")}{" "}
                  (100%)
                </H6>
                <PTag>$5.880,00</PTag>
              </Stack>
            </ServiceBox>
            <ServiceBox>
              <Stack
                justifyContent="space-between"
                height="100%"
                direction="row"
              >
                <H6>{budgetT("tabService.totalArea.invoicing.title")}</H6>
                <Typography
                  variant="h6"
                  sx={{
                    textTransform: "capitalize",
                    color: "#693dfb",
                    cursor: "pointer",
                  }}
                >
                  {budgetT("tabService.totalArea.invoicing.newInvoice")}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <H6>{budgetT("tabService.totalArea.invoicing.total")}</H6>
                <PTag>$5.880,00</PTag>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <H6>
                  {budgetT("tabService.totalArea.invoicing.invoiced")} (0%)
                </H6>
                <PTag>$0.00</PTag>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <H6>
                  {budgetT("tabService.totalArea.invoicing.forInvoicing")}{" "}
                  (100%)
                </H6>
                <PTag>$5.880,00</PTag>
              </Stack>
            </ServiceBox>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};
