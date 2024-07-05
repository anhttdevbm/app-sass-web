import { Box, Stack } from "@mui/material";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ScriptableContext,
  Color,
} from "chart.js";
import { Text } from "components/shared";
import { memo } from "react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const labels = ["Paid", "New", "Total"];

const DoughnutChart = () => {
  return (
    <Box position="relative" sx={{ minHeight: 350, flex: 1 }}>
      <Stack
        position="absolute"
        top="60%"
        left="50%"
        sx={{ transform: "translate(-50%, -60%)" }}
        alignItems="center"
      >
        <Text variant="h3" color="text.primary">
          65%
        </Text>
        <Text variant="body2" color="grey.A200" textAlign="center">
          Total New Customers
        </Text>
      </Stack>
      <Box position="absolute" sx={{ width: "100%", height: "100%" }}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Doughnut options={options as any} data={data} />
      </Box>
    </Box>
  );
};

export default memo(DoughnutChart);

const getGradientBackground = (
  context: ScriptableContext<"doughnut">,
  angle: number,
  startColor: string,
  endColor: string,
) => {
  const chart = context.chart;
  const { ctx, chartArea } = chart;

  if (!chartArea) return startColor;

  const x2 = chartArea.bottom * Math.cos(angle); // angle in radians
  const y2 = chartArea.top * Math.sin(angle);

  const gradient = ctx.createLinearGradient(0, x2, 0, y2);
  gradient.addColorStop(0, startColor);
  gradient.addColorStop(1, endColor);

  return gradient as CanvasGradient;
};

const data: ChartData<"doughnut", number[], string> = {
  labels,
  datasets: [
    {
      data: [15, 50, 35],
      backgroundColor: (ctx) =>
        [
          getGradientBackground(ctx, 201, "#CDF4FF", "#F64E60"),
          getGradientBackground(ctx, 164, "#1BC5BD", "#EAABF0"),
          "#F2EFFF",
        ] as unknown as Color,
      borderRadius: 16,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: 83,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Customers that buy products",
      position: "top",
      align: "start",
      padding: {
        top: 10,
        bottom: 30,
      },
      color: "#BABCC6",
      font: {
        size: 14,
        lineHeight: 1.57,
      },
    },
  },
};
