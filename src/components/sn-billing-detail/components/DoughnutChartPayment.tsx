import { Box, Stack, Typography } from "@mui/material";
import {
  ArcElement,
  ChartData,
  Chart as ChartJS,
  Color,
  Legend,
  Tooltip,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);
const labels = ["Write off", "Paid", "Balance due"];

const data: ChartData<"doughnut", number[], string> = {
  labels,
  datasets: [
    {
      data: [6, 44, 50],
      backgroundColor: ["#D32F06", "#14B8A6", "#F59E0B"] as unknown as Color,
    },
  ],
};

const DoughnutChartPayment = () => {
  return (
    <Box sx={{ position: "relative" }}>
      <Stack
        direction="column"
        sx={{
          position: "absolute",
          top: "76px",
          left: "56px",
        }}
      >
        <Typography
          color="#737373"
          fontSize={12}
          fontWeight={500}
          align="center"
        >
          Total Amount
        </Typography>
        <Typography color="#0A0A0A" fontSize={28} fontWeight={700}>
          5000,00
        </Typography>
      </Stack>
      <Doughnut height={210} width={210} options={options as any} data={data} />
    </Box>
  );
};

export default DoughnutChartPayment;

const options = {
  responsive: true,
  cutout: 75,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
};
