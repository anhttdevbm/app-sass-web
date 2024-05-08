"use client";
import { ReactElement, useCallback, useMemo, useState } from "react";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Title,
} from "chart.js";
import { useTranslations } from "next-intl";
import _ from "lodash";

import { Permission } from "constant/enums";
import { NS_COMMON, NS_COST_RATE } from "constant/index";
import { Text } from "components/shared";
import DefaultPopupLayout from "layouts/DefaultPopupLayout";
import CalendarIcon from "icons/CalendarIcon";
import ProcessRing from "../components/ProcessRing";
import useToggle from "hooks/useToggle";
import { useCostRate } from "store/employeeDetail/selectors";
import { useAuth, useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";
import CostRateForm from "./CostRateForm";
import CostRateTable from "../components/CostRateTable";

const CostRateInfo = () => {
  const { user } = useAuth();
  const commonT = useTranslations(NS_COMMON);
  const costRateT = useTranslations(NS_COST_RATE);

  const { selectCurrentCostRate, selectAllCostRate, handleDeleteCostRate } =
    useCostRate();

  const { onAddSnackbar } = useSnackbar();
  const [isModalOpen, openModal, closeModal] = useToggle(false);
  const [costRateToEditId, setCostRateToEditId] = useState("");
  const isAdmin = useMemo(
    () => user?.roles.includes(Permission.AM),
    [user?.roles],
  );

  const handleItemEdit = useCallback(
    (id: string) => {
      setCostRateToEditId(id);
      openModal();
    },
    [openModal],
  );

  const handleItemDelete = useCallback(
    async (id: string) => {
      try {
        await handleDeleteCostRate(id);
        onAddSnackbar(costRateT("notification.deleteSuccess"), "success");
      } catch (error) {
        onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
      }
    },
    [commonT, costRateT, handleDeleteCostRate, onAddSnackbar],
  );

  const handleCloseForm = () => {
    setCostRateToEditId("");
    closeModal();
  };

  const chartCostData = useMemo(() => {
    const data: { label: string; data: number }[] = [];
    const today = dayjs().startOf("day");
    const dateFormat = "MMM DD";
    if (!selectCurrentCostRate) {
      for (let i = -4; i <= 4; i++) {
        data.push({
          label: today.add(i, "day").format(dateFormat),
          data: 0,
        });
      }
    } else {
      const startDate = dayjs(selectCurrentCostRate.start_date).startOf("day");
      const endDate = dayjs(selectCurrentCostRate.end_date).startOf("day");
      let tmpDate = today.add(-1, "day");
      while (
        !tmpDate.isBefore(today.add(-4, "day")) &&
        !tmpDate.isBefore(startDate)
      ) {
        tmpDate = tmpDate.add(-1, "day");
      }
      while (
        !tmpDate.isAfter(today.add(4, "day")) &&
        !tmpDate.isAfter(endDate)
      ) {
        const hours =
          selectCurrentCostRate.working_hours[(tmpDate.day() + 6) % 7];
        data.push({
          label: tmpDate.format(dateFormat),
          data: hours * (selectCurrentCostRate.cost_per_hour ?? 0),
        });
        tmpDate = tmpDate.add(1, "day");
      }
    }
    return data;
  }, [selectCurrentCostRate]);
  const chartData = useMemo(
    () => ({
      labels: chartCostData.map((i) => i.label),
      datasets: [
        {
          data: chartCostData.map((i) => i.data),
          borderColor: "#14B9E5",
          pointBorderColor: "#14B9E5",
          pointBackgroundColor: "#14B9E5",
          backgroundColor: ({ chart: { ctx } }) => {
            const bg = ctx.createLinearGradient(0, 0, 400, 0);
            bg.addColorStop(0, "#2AF59833");
            bg.addColorStop(1, "#009EFD33");
            return bg;
          },
          fill: "start",
          tension: 0.4,
        },
      ],
    }),
    [chartCostData],
  );
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          grid: {
            display: false,
          },
        },
      },
    }),
    [],
  );
  ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Filler,
    Title,
  );

  return (
    <Box
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 4.5,
        padding: {
          xs: 3,
          sm: 4,
        },
        flexGrow: 1,
        mt: 2,
        mb: 4,
        ml: {
          xs: 3,
          sm: 6,
        },
        mr: {
          xs: 3,
          sm: 4,
        },
      }}
    >
      <Text
        fontSize={{
          xs: 20,
          sm: 22,
        }}
        fontWeight={600}
        variant="h3"
        color="grey.800"
      >
        {costRateT("info.currentCostRate")}
      </Text>

      <Grid container mt={5} spacing={3}>
        <Grid item container xs={12} md={8}>
          <Box position="relative" width="100%">
            <Line data={chartData} options={chartOptions} />
          </Box>
        </Grid>
        <Grid item container xs={12} md={4} justifyContent="center">
          <Stack direction="column" alignItems="center">
            <ProcessRing
              size={240}
              percentage={Math.round(
                (((selectCurrentCostRate?.total_days ?? 0) -
                  (selectCurrentCostRate?.remaining_days ?? 0)) /
                  (selectCurrentCostRate?.total_days ?? 1)) *
                  100,
              )}
            >
              <Text fontSize={28}>
                {selectCurrentCostRate?.remaining_days ?? 0}
              </Text>
            </ProcessRing>
            <Text fontSize={20} fontWeight={600} mt={3}>
              {costRateT("info.workingDays")}
            </Text>
          </Stack>
        </Grid>
      </Grid>

      <Grid
        container
        py={6}
        spacing={{
          xs: 2,
          sm: 4,
          md: 6,
        }}
      >
        <Grid item xs={12} sm={6} md={4} container>
          <CurrentRateBlock
            icon={<CalendarIcon />}
            title={costRateT("info.costType")}
            content={_.capitalize(selectCurrentCostRate?.type) ?? "N/A"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} container justifyContent={{ sm: "end", md: "center" }}>
          <CurrentRateBlock
            icon={<CalendarIcon />}
            title={costRateT("info.costPerMonth")}
            content={
              selectCurrentCostRate?.cost_per_month
                ? `${selectCurrentCostRate?.cost_per_month}.$`
                : "N/A"
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} container justifyContent={{ md: "end" }}>
          <CurrentRateBlock
            icon={<CalendarIcon />}
            title={costRateT("info.atCurrentCostRate")}
            content={
              selectCurrentCostRate?.total_days
                ? `${selectCurrentCostRate?.total_days}h`
                : "N/A"
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} container justifyContent={{ sm: "end", md: "initial" }}>
          <CurrentRateBlock
            icon={<CalendarIcon />}
            title={costRateT("info.capacity")}
            content={
              selectCurrentCostRate?.total_hours
                ? `${selectCurrentCostRate?.total_hours}h`
                : "N/A"
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} container justifyContent={{ md: "center" }}>
          <CurrentRateBlock
            icon={<CalendarIcon />}
            title={costRateT("info.currentHourlyCost")}
            content={
              selectCurrentCostRate?.cost_per_hour
                ? `${selectCurrentCostRate?.cost_per_hour}`
                : "N/A"
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} container justifyContent={{ sm: "end" }}>
          <CurrentRateBlock
            icon={<CalendarIcon />}
            title={costRateT("info.overhead")}
            content={selectCurrentCostRate?.over_head ? "Yes" : "No"}
          />
        </Grid>
      </Grid>

      <Stack
        border={1}
        borderColor="#14B9E5"
        borderRadius={3}
        px={4}
        py={{
          xs: 2,
          sm: 3,
        }}
      >
        <Text color="grey.800" fontSize={20} fontWeight={600}>
          Note
        </Text>
        <Text color="grey.700" mt={0.5}>
          {selectCurrentCostRate?.note}
        </Text>
      </Stack>

      <Text
        fontSize={{
          xs: 18,
          sm: 22,
        }}
        fontWeight={600}
        variant="h3"
        color="grey.800"
        mt={{
          xs: 3,
          sm: 6,
        }}
        mb={2}
      >
        Cost Rate
      </Text>

      <Box width="100%" overflow="hidden">
        <CostRateTable
          items={selectAllCostRate}
          isEditable={isAdmin}
          handleItemEdit={handleItemEdit}
          handleItemDelete={handleItemDelete}
        />
      </Box>

      {isAdmin ? (
        <>
          <DefaultPopupLayout
            open={isModalOpen}
            title="Edit Cost Rate"
            onClose={handleCloseForm}
            sx={{ borderRadius: "24px" }}
          >
            <DialogContent>
              <CostRateForm
                costRateId={costRateToEditId}
                onCancel={handleCloseForm}
              />
            </DialogContent>
          </DefaultPopupLayout>
        </>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default CostRateInfo;

const CurrentRateBlock = ({
  title,
  content,
  icon,
}: {
  title: string;
  content: string;
  icon: ReactElement;
}) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      border={1}
      borderColor="divider"
      borderRadius={3}
      py={1.5}
      pl={3}
      pr={2}
      maxWidth={{
        xs: "initial",
        sm: 266,
      }}
      sx={{
        width: "100%",
      }}
    >
      {icon}
      <Stack direction="column" spacing={{ xs: 0, sm: 0.5 }}>
        <Text
          color="grey.800"
          fontSize={18}
          fontWeight={600}
          whiteSpace="nowrap"
          textOverflow="ellipsis"
        >
          {title}
        </Text>
        <Text color="grey.800">{content}</Text>
      </Stack>
    </Stack>
  );
};
