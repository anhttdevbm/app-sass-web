import { Box, Grid } from "@mui/material";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Filler, Title } from 'chart.js';


import { Text } from "components/shared";
import { useCostRate } from "store/costRate/selectors";

import ProcessRing from "../components/ProcessRing";

const CostRateInfo = () => {
  const { currentRate } = useCostRate();

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
        mt={4}
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
          <ProcessRing size={256} percentage={75}>
            <Text fontSize={33}>22</Text>
          </ProcessRing>
        </Grid>
      </Grid>

    </Box>
  )
}

export default CostRateInfo;
