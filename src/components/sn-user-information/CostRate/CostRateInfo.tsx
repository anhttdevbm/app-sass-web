import { ReactElement } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Filler, Title } from 'chart.js';
import dayjs from "dayjs";

import { Text } from "components/shared";
import CalendarIcon from "icons/CalendarIcon";
import { useCostRate } from "store/costRate/selectors";
import ProcessRing from "../components/ProcessRing";

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
      <Stack direction="column" spacing={1}>
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
  const { currentRate, remainingRates } = useCostRate();

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
      border={1}
      borderColor="divider"
      borderRadius={6}
      padding={4.5}
    >
      <Text fontSize={25} fontWeight={600} variant="h3" color="grey.800">Current Cost Rate</Text>

      <Grid
        container
        mt={5}
        spacing={3}
      >
        <Grid item container xs={8}>
          <Box position="relative" width="100%">
            <Line
              data={chartData}
              options={chartOptions}
            />
          </Box>
        </Grid>
        <Grid item container xs={4} justifyContent="end">
          <Stack direction="column" alignItems="center">
            <ProcessRing size={256} percentage={75}>
              <Text fontSize={33}>22</Text>
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
        <Grid item xs={4}>
          <CurrentRateBlock
            icon={<CalendarIcon />}
            title="Cost Type"
            content={currentRate?.type ?? 'N/A'}
          />
        </Grid>
        <Grid item xs={4}>
          <CurrentRateBlock
            icon={<CalendarIcon />}
            title="Cost Per Month"
            content={currentRate?.cost_per_month ? `${currentRate.cost_per_month}.$` : 'N/A'}
          />
        </Grid>
        <Grid item xs={4}>
          <CurrentRateBlock
            icon={<CalendarIcon />}
            title="At current cost rate"
            content="N/A"
          />
        </Grid>
        <Grid item xs={4}>
          <CurrentRateBlock
            icon={<CalendarIcon />}
            title="Capacity"
            content={currentRate?.total_hours ? `${currentRate.total_hours}h` : 'N/A'}
          />
        </Grid>
        <Grid item xs={4}>
          <CurrentRateBlock
            icon={<CalendarIcon />}
            title="Current Hourly Cost"
            content="N/A"
          />
        </Grid>
        <Grid item xs={4}>
          <CurrentRateBlock
            icon={<CalendarIcon />}
            title="Overhead"
            content="N/A"
          />
        </Grid>
        <Grid item xs={12}>
          <Stack border={1} borderColor="#14B9E5" borderRadius={3} padding={4}>
            <Text color="grey.800" fontSize={20} fontWeight={600}>Note</Text>
            <Text color="grey.700" mt={1}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos modi ex autem ut reprehenderit veritatis commodi? Beatae aut tenetur quam cum ut eius, voluptates velit repellendus iure sint modi ratione.</Text>
          </Stack>
        </Grid>
      </Grid>

      <Text fontSize={25} fontWeight={600} variant="h3" color="grey.800" mt={6} mb={2}>Cost Rate</Text>

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
              "& th:nth-child(7)": {
                width: "20%",
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
    </Box>
  )
}

export default CostRateInfo;
