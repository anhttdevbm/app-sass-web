/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Stack, Typography } from "@mui/material";
import { NS_BUDGETING, SALE_API_URL } from "constant/index";
import useTheme from "hooks/useTheme";
import _ from "lodash";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { H6, PTag, ServiceBox } from "./ServiceUtil";
// import TimeIcon from "public/images/ic-time.svg";
import Grid from "@mui/material/Unstable_Grid2";
import { client, Endpoint } from "api";
import { Progress } from "components/shared/Progress";
import BudgetsIcon from "icons/BudgetsIcon";
import BudgetTimeIcon from "icons/BudgetTimeIcon";
import InvoicingIcon from "icons/InvoicingIcon";
import ProfitIcon from "icons/ProfitIcon";

interface Props {
  serviceData: any;
}

interface TimeData {
  budgetedTime: number;
  usedTime: number;
  billableTime: number;
  remainingTime: number;
}

interface BudgetData {
  totalBudget: number;
  budgetUsed: number;
  budgetRemaining: number;
  percentageUsed: number;
}

interface ProfitData {
  totalRevenue: number;
  cost: number;
  profit: number;
  percentageOfProfit: number;
}

interface InvoicingData {
  totalInvoice: number;
  invoiced: number;
  forInvoicing: number;
  percentageInvoiced: number;
}

interface BudgetStatistics {
  time: TimeData;
  budget: BudgetData;
  profit: ProfitData;
  invoicing: InvoicingData;
}

export const ServiceAreaTotal = ({ serviceData }: Props) => {
  const budgetT = useTranslations(NS_BUDGETING);
  const { push } = useRouter();
  const { id } = useParams();
  const { isDarkMode } = useTheme();
  const [data, setBudgetStatistics] = useState<BudgetStatistics | null>(null);


  const remainingTimeRate = useMemo(() => {
    return (
      (Number(_.get(serviceData, "remainingTime", 0)) /
        Number(_.get(serviceData, "estimatedTime", 0))) *
      100 || 0
    );
  }, [serviceData]);

 

  useEffect(() => {
    const getBudgetStatistics = async () => {
      if (typeof id === 'string') {
        try {
          const response = await client.get(
            Endpoint.GET_BUDGET_STATISTICSBY_ID.replace("{id}", id),
            {},
            { baseURL: SALE_API_URL }
          );
          setBudgetStatistics(response.data);
        } catch (error) {
          console.error("Error fetching budget statistics:", error);
        }
      } else {
        console.error("Invalid id:", id);
      }
    };

    getBudgetStatistics();
    
  }, [id]);

  

  const formatCurrency = (value: number): string => {
    return `$${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };
  return (
    <Box
      sx={{
        // position: "sticky !important",
        // top: "170px", 
        background: isDarkMode ? "#313130" : "white",
        // zIndex: 10,
      }}
    >
      <Grid container spacing={2}>
        <Grid height={"auto"} xs={12} sm={6} sx={{width:{md:"24%",lg:"25%"}}}>
          <Box
            height={"100%"}
            sx={{
              border: "none",
              overflow: "hidden",
              flex: 1,
              "& .MuiStack-root": { height: "100%" },
              borderRadius: "15px",
              boxShadow: " 0px 10px 20px 0px #00000014",
            }}
          >
            <ServiceBox
              // remaining={`${
              //   _.isEmpty(remainingTimeRate) ? 0 : remainingTimeRate
              // }%`}
            >
              <Stack
                width="100%"
                sx={{
                  padding: "10px",
                  background: "#14B9E5",
                  color: "white",
                }}
                direction="row"
                justifyContent="space-between"
              >
                <Stack flexDirection={"row"}>
                  <BudgetTimeIcon />
                  <H6 >{budgetT("tabService.totalArea.time.title")}</H6>
                </Stack>
                {/* <PTag>{moment().format("D MMM, YYYY")}</PTag> */}
              </Stack>
              <Stack gap={1} p={"10px"} pt={"0px"}>

                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">{budgetT("tabService.totalArea.time.budgetedTime")}</H6>
                  <PTag fontSize="13px">{data?.time.budgetedTime}</PTag>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">{budgetT("tabService.totalArea.time.billableTime")}</H6>
                  <PTag fontSize="13px">{data?.time.billableTime}</PTag>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">{budgetT("tabService.totalArea.time.estimatedTime")}</H6>
                  <PTag fontSize="13px">{data?.time.usedTime}</PTag>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">{budgetT("tabService.totalArea.time.workedTime")}</H6>
                  <PTag fontSize="13px">{data?.time.usedTime}</PTag>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">
                    {budgetT("tabService.totalArea.time.remainingTime")}
                    {/*(*/}
                    {/*{_.isEmpty(remainingTimeRate) ? 0 : remainingTimeRate}%)*/}
                  </H6>
                  <Typography fontSize="13px" sx={{
                    background: "-webkit-linear-gradient(0deg, #2AF598 0%, #009EFD 100%)",
                    "-webkit-background-clip": "text",
                    "-webkit-text-fill-color": "transparent",
                  }} component="p">{data?.time.remainingTime}</Typography>
                </Stack>
              </Stack>
            </ServiceBox>
          </Box>
        </Grid>
        <Grid height={"auto"} xs={12} sm={6} sx={{width:{md:"24%" ,lg:"25%"}}}> <Box height={"100%"}
          sx={{
            border: "none",
            overflow: "hidden",
            flex: 1,
            borderRadius: "15px",
            boxShadow: " 0px 10px 20px 0px #00000014",
          }}
        >
          <Stack direction="column" gap={1}>
            <ServiceBox>
              <Stack
                width="100%"
                sx={{
                  padding: "10px",

                  background: "#14B9E5",
                  color: "white",
                }}
                direction="row"
                justifyContent="space-between"
              >
                <Stack flexDirection={"row"}>
                  <ProfitIcon />
                  <H6 >{budgetT("tabService.totalArea.profit.title")}</H6>
                </Stack>
                {/* <PTag>{moment().format("D MMM, YYYY")}</PTag> */}
              </Stack>
              <Stack gap={1} p={"10px"} pt={"0px"}>
                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">{budgetT("tabService.totalArea.profit.revenue")}</H6>
                  <PTag fontSize="13px">{formatCurrency(data?.profit?.totalRevenue ?? 0)}</PTag>                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">{budgetT("tabService.totalArea.profit.cost")}</H6>
                  <PTag fontSize="13px">{formatCurrency(data?.profit?.cost ?? 0)}</PTag>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">{budgetT("tabService.totalArea.profit.profit")}</H6>
                  <Typography fontSize="13px" sx={{
                      background: (data?.profit?.profit ?? -1) < 0 
                      ? "red" 
                      : "-webkit-linear-gradient(0deg, #2AF598 0%, #009EFD 100%)",
                    "-webkit-background-clip": "text",
                    "-webkit-text-fill-color": "transparent",
                  }} component="p">{formatCurrency(data?.profit?.profit ?? 0)}</Typography>
                </Stack>
                {Progress(data?.profit?.percentageOfProfit ?? 0)}
              </Stack>
            </ServiceBox>
          </Stack>
        </Box> </Grid>
        <Grid height={"auto"} xs={12} sm={6}  sx={{width:{md:"24%" ,lg:"25%"}}}> <Box height={"100%"}
          sx={{
            border: "none",
            overflow: "hidden",
            flex: 1,
            borderRadius: "15px",
            boxShadow: " 0px 10px 20px 0px #00000014",
          }}
        >
          <Stack direction="column" gap={1}>
            <ServiceBox>
              <Stack
                direction="row"
                justifyContent="space-between"
                width="100%"
                sx={{
                  padding: "10px",
                  background: "#14B9E5",
                  color: "white",
                }}
              >
                <Stack flexDirection={"row"}>
                  <BudgetsIcon />
                  <H6>{budgetT("tabService.totalArea.budget.title")}</H6>
                </Stack>
                {/* <PTag>{moment().format("D MMM, YYYY")}</PTag> */}
              </Stack>

              <Stack gap={1} p={"10px"} pt={"0px"}>
                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">{budgetT("tabService.totalArea.budget.budgetTotal")}</H6>
                  <PTag fontSize="13px">{formatCurrency(data?.budget.totalBudget ?? 0)}</PTag>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">{budgetT("tabService.totalArea.budget.budgetUsed")}</H6>
                  <PTag fontSize="13px">{formatCurrency(data?.budget.budgetUsed ?? 0)}</PTag>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">
                    {budgetT("tabService.totalArea.budget.budgetRemaining")}
                  </H6>
                    <Typography fontSize="13px" sx={{
                    background: (data?.budget?.budgetRemaining ?? -1) < 0 
                      ? "red" 
                      : "-webkit-linear-gradient(0deg, #2AF598 0%, #009EFD 100%)",
                    "-webkit-background-clip": "text",
                    "-webkit-text-fill-color": "transparent",
                    }} component="p">
                    {formatCurrency(data?.budget.budgetRemaining ?? 0)}
                    </Typography>
                </Stack>
                {Progress(data?.budget.percentageUsed ?? 0)}
              </Stack>
            </ServiceBox>
          </Stack>
        </Box>
        </Grid>
        <Grid height={"auto"} xs={12} sm={6}   sx={{width:{md:"24%" ,lg:"25%"}}}> <Box height={"100%"}
          sx={{
            border: "none",
            overflow: "hidden",
            flex: 1,
            borderRadius: "15px",
            boxShadow: " 0px 10px 20px 0px #00000014",
          }}
        >
          <Stack direction="column" gap={1}>
            <ServiceBox>
              <Stack
                direction="row"
                justifyContent="space-between"
                width="100%"
                sx={{
                  padding: "10px",

                  background: "#14B9E5",
                  color: "white",
                }}
              >

                <Stack flexDirection={"row"}>
                  <InvoicingIcon />
                  <H6> {budgetT("tabService.totalArea.invoicing.title")}</H6>
                </Stack>
                {/* <PTag >{moment().format("D MMM, YYYY")}</PTag> */}
              </Stack>
              <Stack gap={1} p={"10px"} pt={"0px"}>
                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">{budgetT("tabService.totalArea.invoicing.total")}</H6>
                  <PTag fontSize="13px">{formatCurrency(data?.invoicing.totalInvoice ?? 0)}</PTag>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">
                    {budgetT("tabService.totalArea.invoicing.invoiced")} 
                    {/* (0%) */}
                  </H6>
                  <PTag fontSize="13px">{formatCurrency(data?.invoicing.invoiced ?? 0)}</PTag>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">
                    {budgetT("tabService.totalArea.invoicing.forInvoicing")}
                    {/* (100%) */}
                  </H6>
                  <PTag fontSize="13px">{formatCurrency(data?.invoicing.forInvoicing ?? 0)}</PTag>
                </Stack>

                {Progress(data?.invoicing.percentageInvoiced ?? 0)}
              </Stack>
            </ServiceBox>
          </Stack>
        </Box>
        </Grid> </Grid>
    </Box>
  );
};
