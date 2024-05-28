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
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import TimeIcon from "public/images/ic-time.svg";
import ProfitIcon from "public/images/ic-profit.svg";
import BudgetIcon from "public/images/ic-budget.svg";
import InvoicingIcon from "public/images/ic-invoicing.svg";
import GoogleLogo from "public/images/ic-google.svg";
import Image from "next/image";
import Grid from "@mui/material/Unstable_Grid2";

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

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 22,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
    },
  }));
  const Progress = (value) => {
    return (
      <Box sx={{ position: "relative" }}>
        <BorderLinearProgress
          sx={{
            width: `${value}%`,
            ".MuiLinearProgress-bar": {
              transform: "none!important",
              background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
              borderRadius: "100px",
            },
          }}
          variant="determinate"
          value={100}
        />
        <Box
          sx={{
            top: 0,
            left: `${value - 15}%`,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            color: "white",
            fontSize:"13px",
            fontWeight:700
          }}
        >
          {value}%
        </Box>
      </Box>
    );
  };
  return (
    <Box
      sx={{
        position: "sticky !important",
        top: "170px", // header height
        background: isDarkMode ? "#313130" : "white",
        zIndex: 10,
      }}
    >
      <Grid container spacing={2}>
        <Grid height={"auto"} xs={12} sm={6} sx={{width:{md:"28%",lg:"33.8461538462%"}}}>
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
                  <Image src={TimeIcon} alt="Time Icon" width={24} />
                  <H6 >{budgetT("tabService.totalArea.time.title")}</H6>
                </Stack>
                <PTag>{moment().format("D MMM, YYYY")}</PTag>
              </Stack>
              <Stack gap={1} p={"10px"} pt={"0px"}>

                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">{budgetT("tabService.totalArea.time.budgetedTime")}</H6>
                  <PTag fontSize="13px">00:00</PTag>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">{budgetT("tabService.totalArea.time.billableTime")}</H6>
                  <PTag fontSize="13px">00:00</PTag>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">{budgetT("tabService.totalArea.time.estimatedTime")}</H6>
                  <PTag fontSize="13px"> {_.get(serviceData, "allTime", "00:00")}</PTag>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">{budgetT("tabService.totalArea.time.workedTime")}</H6>
                  <PTag fontSize="13px">{_.get(serviceData, "allTimeUsed", "00:00")}</PTag>
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
                  }} component="p">{_.get(serviceData, "remainingTime", "00:00")}</Typography>
                </Stack>
              </Stack>
            </ServiceBox>
          </Box>
        </Grid>
        <Grid height={"auto"} xs={12} sm={6} sx={{width:{md:"24%" ,lg:"22.0512820513%"}}}> <Box height={"100%"}
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
                  <Image src={ProfitIcon} alt="Profit Icon" width={24} />
                  <H6 >{budgetT("tabService.totalArea.profit.title")}</H6>
                </Stack>
                <PTag>{moment().format("D MMM, YYYY")}</PTag>
              </Stack>
              <Stack gap={1} p={"10px"} pt={"0px"}>
                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">{budgetT("tabService.totalArea.profit.revenue")}</H6>
                  <PTag fontSize="13px">$0,00</PTag>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">{budgetT("tabService.totalArea.profit.cost")}</H6>
                  <PTag fontSize="13px">$0,00</PTag>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">{budgetT("tabService.totalArea.profit.profit")}</H6>
                  <Typography fontSize="13px" sx={{
                    background: "-webkit-linear-gradient(0deg, #2AF598 0%, #009EFD 100%)",
                    "-webkit-background-clip": "text",
                    "-webkit-text-fill-color": "transparent",
                  }} component="p">$0,00</Typography>
                </Stack>
                {Progress(50)}
              </Stack>
            </ServiceBox>
          </Stack>
        </Box> </Grid>
        <Grid height={"auto"} xs={12} sm={6}  sx={{width:{md:"24%" ,lg:"22.0512820513%"}}}> <Box height={"100%"}
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
                  <Image src={BudgetIcon} alt="Budget Icon" width={24} />
                  <H6>{budgetT("tabService.totalArea.budget.title")}</H6>
                </Stack>
                <PTag>{moment().format("D MMM, YYYY")}</PTag>
              </Stack>

              <Stack gap={1} p={"10px"} pt={"0px"}>
                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">{budgetT("tabService.totalArea.budget.budgetTotal")}</H6>
                  <PTag fontSize="13px">
                    ${_.round(_.get(serviceData, "allBudgetTotal", 0), 2)}
                  </PTag>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">{budgetT("tabService.totalArea.budget.budgetUsed")}</H6>
                  <PTag fontSize="13px">
                    ${_.round(_.get(serviceData, "allBudgetUsed", 0))}
                  </PTag>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">
                    {budgetT("tabService.totalArea.budget.budgetRemaining")}
                  </H6>
                  <Typography fontSize="13px" sx={{
                    background: "-webkit-linear-gradient(0deg, #2AF598 0%, #009EFD 100%)",
                    "-webkit-background-clip": "text",
                    "-webkit-text-fill-color": "transparent",
                  }} component="p">$0,00</Typography>
                </Stack>
                {Progress(50)}
              </Stack>
            </ServiceBox>
          </Stack>
        </Box>
        </Grid>
        <Grid height={"auto"} xs={12} sm={6}   sx={{width:{md:"24%" ,lg:"22.0512820513%"}}}> <Box height={"100%"}
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
                  <Image src={InvoicingIcon} alt="Invoicing Icon" width={24} />
                  <H6>{budgetT("tabService.totalArea.invoicing.title")}</H6>
                </Stack>
                <PTag >{moment().format("D MMM, YYYY")}</PTag>
              </Stack>
              <Stack gap={1} p={"10px"} pt={"0px"}>
                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">{budgetT("tabService.totalArea.invoicing.total")}</H6>
                  <PTag fontSize="13px">$5.880,00</PTag>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">
                    {budgetT("tabService.totalArea.invoicing.invoiced")} (0%)
                  </H6>
                  <PTag fontSize="13px">$0.00</PTag>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <H6 fontSize="13px">
                    {budgetT("tabService.totalArea.invoicing.forInvoicing")}
                    (100%)
                  </H6>
                  <PTag fontSize="13px">$5.880,00</PTag>
                </Stack>

                {Progress(50)}
              </Stack>
            </ServiceBox>
          </Stack>
        </Box>
        </Grid> </Grid>
    </Box>
  );
};
