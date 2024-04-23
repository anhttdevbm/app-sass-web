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
import { Formik } from "formik";
import _ from "lodash";

import { Permission } from "constant/enums";
import { NS_COMMON, NS_COST_RATE } from "constant/index";
import { Text } from "components/shared";
import DefaultPopupLayout from "layouts/DefaultPopupLayout";
import CalendarIcon from "icons/CalendarIcon";
import ProcessRing from "../components/ProcessRing";
import useToggle from "hooks/useToggle";
import { UpdateCostRate } from "store/employeeDetail/actions";
import { CostRate } from "store/employeeDetail/reducer";
import { useCostRate } from "store/employeeDetail/selectors";
import { useAuth, useSnackbar } from "store/app/selectors";
import { getDataFromKeys, getMessageErrorByAPI } from "utils/index";
import CostRateForm, { EditCostRateForm } from "./CostRateForm";
import CostRateTable from "../components/CostRateTable";

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

const CostRateInfo = () => {
  const { user } = useAuth();
  const commonT = useTranslations(NS_COMMON);
  const costRateT = useTranslations(NS_COST_RATE);
  const { onAddSnackbar } = useSnackbar();
  const [isModalOpen, openModal, closeModal] = useToggle(false);
  const {
    selectCurrentCostRate,
    selectAllCostRate,
    handleUpdateCostRate,
    handleDeleteCostRate,
  } = useCostRate();

  const [costRateToEdit, setCostRateToEdit] = useState<CostRate | undefined>(
    undefined,
  );
  const isAdmin = useMemo(
    () => user?.roles.includes(Permission.AM),
    [user?.roles],
  );

  const handleItemEdit = useCallback(
    (id: string) => {
      const rate = selectAllCostRate.find((r) => r?.id === id);
      if (rate) {
        setCostRateToEdit(rate);
        openModal();
      }
    },
    [selectAllCostRate, openModal],
  );

  const handleItemDelete = useCallback(
    async (id: string) => {
      try {
        await handleDeleteCostRate(id);
        onAddSnackbar(costRateT("empty.notification.updateSuccess"), "success");
      } catch (error) {
        onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
      }
    },
    [commonT, costRateT, handleDeleteCostRate, onAddSnackbar],
  );

  const handleCloseForm = () => {
    setCostRateToEdit(undefined);
    closeModal();
  };

  const onSubmit = async (values: EditCostRateForm) => {
    try {
      const data = {
        ...values,
        id: costRateToEdit?.id ?? "",
        working_hours: [
          values.working_hours.mon,
          values.working_hours.tue,
          values.working_hours.wed,
          values.working_hours.thu,
          values.working_hours.fri,
          values.working_hours.sat,
          values.working_hours.sun,
        ],
      } as UpdateCostRate;
      await handleUpdateCostRate(data);
      onAddSnackbar(costRateT("empty.notification.updateSuccess"), "success");
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

  const initialValues = useMemo(
    () =>
      costRateToEdit
        ? {
            ...getDataFromKeys(costRateToEdit, [
              "id",
              "type",
              "cost_per_month",
              "currency",
              "start_date",
              "end_date",
              "holiday_calendar",
              "note",
              "over_head",
            ]),
            working_hours: {
              mon: costRateToEdit?.working_hours[0] ?? 8,
              tue: costRateToEdit?.working_hours[1] ?? 8,
              wed: costRateToEdit?.working_hours[2] ?? 8,
              thu: costRateToEdit?.working_hours[3] ?? 8,
              fri: costRateToEdit?.working_hours[4] ?? 8,
              sat: costRateToEdit?.working_hours[5] ?? 0,
              sun: costRateToEdit?.working_hours[6] ?? 0,
            },
          }
        : undefined,
    [costRateToEdit],
  ) as EditCostRateForm;

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
        Current Cost Rate
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
              Working Days
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
        <Grid item xs={12} sm={6} md={4}>
          <CurrentRateBlock
            icon={<CalendarIcon />}
            title="Cost Type"
            content={_.capitalize(selectCurrentCostRate?.type) ?? "N/A"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CurrentRateBlock
            icon={<CalendarIcon />}
            title="Cost Per Month"
            content={
              selectCurrentCostRate?.cost_per_month
                ? `${selectCurrentCostRate?.cost_per_month}.$`
                : "N/A"
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CurrentRateBlock
            icon={<CalendarIcon />}
            title="At current cost rate"
            content={
              selectCurrentCostRate?.total_days
                ? `${selectCurrentCostRate?.total_days}h`
                : "N/A"
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CurrentRateBlock
            icon={<CalendarIcon />}
            title="Capacity"
            content={
              selectCurrentCostRate?.total_hours
                ? `${selectCurrentCostRate?.total_hours}h`
                : "N/A"
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CurrentRateBlock
            icon={<CalendarIcon />}
            title="Current Hourly Cost"
            content={
              selectCurrentCostRate?.cost_per_hour
                ? `${selectCurrentCostRate?.cost_per_hour}`
                : "N/A"
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CurrentRateBlock
            icon={<CalendarIcon />}
            title="Overhead"
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
              <Formik initialValues={initialValues} onSubmit={onSubmit}>
                {(props) => (
                  <CostRateForm formik={props} onCancel={handleCloseForm} />
                )}
              </Formik>
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
