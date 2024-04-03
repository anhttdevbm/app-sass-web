import { ReactElement, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Filler, Title } from 'chart.js';
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { Formik } from "formik";

import { Permission } from "constant/enums";
import { NS_COMMON, NS_COST_RATE } from "constant/index";
import { Text } from "components/shared";
import DefaultPopupLayout from "layouts/DefaultPopupLayout";
import CalendarIcon from "icons/CalendarIcon";
import ProcessRing from "../components/ProcessRing";
import useToggle from "hooks/useToggle";
import { UpdateCostRate } from "store/costRate/actions";
import { useCostRate } from "store/costRate/selectors";
import { useAuth, useSnackbar } from "store/app/selectors";
import CostRateForm, { NewCostRateForm } from "./CostRateForm";
import { getDataFromKeys, getMessageErrorByAPI } from "utils/index";

const CurrentRateBlock = ({title, content, icon}: {
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
      padding={2}
      maxWidth={266}
    >
      {icon}
      <Stack direction="column" spacing={{ xs: 0, sm: 1 }}>
        <Text color="grey.800" fontSize={20} fontWeight={600} whiteSpace="nowrap" textOverflow="ellipsis">{title}</Text>
        <Text color="grey.800">{content}</Text>
      </Stack>
    </Stack>
  )
}

const StyledBodyCell = styled(TableCell)({
  border: 0,
  padding: 20,
})

const CostRateInfo = () => {
  const { user } = useAuth();
  const commonT = useTranslations(NS_COMMON);
  const costRateT = useTranslations(NS_COST_RATE);
  const { onAddSnackbar } = useSnackbar();
  const [ isModalOpen, openModal, closeModal ] = useToggle(false);
  const { currentRate, remainingRates, handleUpdateCostRate } = useCostRate();
  // const [ editCostRateId, setEditCostRateId ] = useState("");

  const onSubmit = async (values: NewCostRateForm) => {
    try {
      const data = {
        ...values,
        id: currentRate.id,
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
      onAddSnackbar(
        costRateT("empty.notification.updateSuccess"),
        "success",
      );
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

  const initialValues = useMemo(
    () => ({
      ...getDataFromKeys(currentRate, [
        "id",
        "type",
        "cost_per_month",
        "currency",
        "total_hours",
        "start_date",
        "end_date",
        "holiday_calendar",
        "note",
      ]),
      working_hours: {
        mon: currentRate.working_hours[0],
        tue: currentRate.working_hours[1],
        wed: currentRate.working_hours[2],
        thu: currentRate.working_hours[3],
        fri: currentRate.working_hours[4],
        sat: currentRate.working_hours[5],
        sun: currentRate.working_hours[6],
      },
      overhead: true,
    }),
    [currentRate],
  ) as NewCostRateForm;

  const labels = [
    "Mar 18",
    "Mar 19",
    "Mar 20",
    "Mar 21",
    "Mar 22",
    "Mar 23",
    "Mar 24",
    "Mar 27",
    "Mar 30",
  ];
  const datapoints = [ 80, 120, 300, 100, 70, 100, 40, 120, 200 ];
  const chartData = {
    labels,
    datasets: [
      {
        data: datapoints,
        borderColor: "#14B9E5",
        pointBorderColor: "#14B9E5",
        pointBackgroundColor: "#14B9E5",
        backgroundColor: ({chart: {ctx}}) => {
          const bg = ctx.createLinearGradient(0, 0, 400, 0);
          bg.addColorStop(0, '#2AF59833');
          bg.addColorStop(1, '#009EFD33');
          return bg;
        },
        fill: "start",
        tension: 0.4,
      }
    ]
  }
  const chartOptions = {
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
    }
  }
  ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Title);

  return (
    <Box
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: "18px",
        padding: "36px",
        flexGrow: 1,
        marginTop: "16px",
        marginBottom: "36px",
        marginLeft: {
          xs: "24px",
          sm: "48px",
        },
        marginRight: {
          xs: "24px",
          sm: "36px",
        },
      }}
    >
      <Text fontSize={25} fontWeight={600} variant="h3" color="grey.800">Current Cost Rate</Text>

      <Grid
        container
        mt={5}
        spacing={3}
      >
        <Grid item container xs={12} sm={8}>
          <Box position="relative" width="100%">
            <Line
              data={chartData}
              options={chartOptions}
            />
          </Box>
        </Grid>
        <Grid item container xs={12} sm={4} justifyContent="end">
          <Stack direction="column" alignItems="center">
            <ProcessRing size={256} percentage={75}>
              <Text fontSize={33} onClick={() => { openModal() }}>22</Text>
            </ProcessRing>
            <Text fontSize={20} fontWeight={600} mt={3}>Working Days</Text>
          </Stack>
        </Grid>
      </Grid>

      <Grid
        container
        mt={6}
        spacing={6}
      >
        <Grid item xs={12} sm={4}>
          <CurrentRateBlock
            icon={<CalendarIcon />}
            title="Cost Type"
            content={currentRate?.type ?? 'N/A'}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CurrentRateBlock
            icon={<CalendarIcon />}
            title="Cost Per Month"
            content={currentRate?.cost_per_month ? `${currentRate.cost_per_month}.$` : 'N/A'}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CurrentRateBlock
            icon={<CalendarIcon />}
            title="At current cost rate"
            content="N/A"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CurrentRateBlock
            icon={<CalendarIcon />}
            title="Capacity"
            content={currentRate?.total_hours ? `${currentRate.total_hours}h` : 'N/A'}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CurrentRateBlock
            icon={<CalendarIcon />}
            title="Current Hourly Cost"
            content="N/A"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CurrentRateBlock
            icon={<CalendarIcon />}
            title="Overhead"
            content="N/A"
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Stack border={1} borderColor="#14B9E5" borderRadius={3} padding={4}>
            <Text color="grey.800" fontSize={20} fontWeight={600}>Note</Text>
            <Text color="grey.700" mt={1}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos modi ex autem ut reprehenderit veritatis commodi? Beatae aut tenetur quam cum ut eius, voluptates velit repellendus iure sint modi ratione.</Text>
          </Stack>
        </Grid>
      </Grid>

      <Text fontSize={25} fontWeight={600} variant="h3" color="grey.800" mt={6} mb={2}>Cost Rate</Text>

      <Box width="100%" overflow="hidden">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  height: 70,
                  "& th": {
                    border: 0,
                    paddingTop: 2,
                    paddingBottom: 2,
                    paddingLeft: 2.5,
                    paddingRight: 2.5,
                    backgroundColor: "#D9F0FD",
                  },
                  "& th:first-child": {
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                  },
                  "& th:last-child": {
                    borderTopRightRadius: 12,
                    borderBottomRightRadius: 12,
                  },
                  "& th:nth-child(1)": {
                    minWidth: "100px",
                  },
                  "& th:nth-child(2)": {
                    minWidth: "100px",
                  },
                  "& th:nth-child(3)": {
                    minWidth: "100px",
                  },
                  "& th:nth-child(4)": {
                    minWidth: "100px",
                  },
                  "& th:nth-child(5)": {
                    minWidth: "100px",
                  },
                  "& th:nth-child(6)": {
                    minWidth: "100px",
                  },
                  "& th:nth-child(7)": {
                    width: "20%",
                    minWidth: "100px",
                  },
                }}
              >
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Cost Type</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Hourly</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {remainingRates.map((item) =>
                <TableRow key={item.id}>
                  <StyledBodyCell>{dayjs(item.start_date).format('DD MMM, YYYY')}</StyledBodyCell>
                  <StyledBodyCell>{dayjs(item.end_date).format('DD MMM, YYYY')}</StyledBodyCell>
                  <StyledBodyCell>{item.type}</StyledBodyCell>
                  <StyledBodyCell>--</StyledBodyCell>
                  <StyledBodyCell>--</StyledBodyCell>
                  <StyledBodyCell>--</StyledBodyCell>
                  <StyledBodyCell>--</StyledBodyCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {
        user?.roles.includes(Permission.AM)
          ? <>
            <DefaultPopupLayout
              open={isModalOpen}
              title="Edit Cost Rate"
              onClose={() => { closeModal() }}
            >
              <DialogContent>
                <Formik
                  initialValues={initialValues}
                  onSubmit={onSubmit}
                >
                  {
                    (props) =>
                      <CostRateForm
                        formik={props}
                        onCancel={() => { closeModal() }}
                      />
                  }
                </Formik>
              </DialogContent>
            </DefaultPopupLayout>
          </>
          : <></>
      }
    </Box>
  )
}

export default CostRateInfo;
