import { memo, useMemo } from "react";
import { Box, Stack } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  elements,
} from "chart.js";
import { Bar, ChartProps } from "react-chartjs-2";
import { formatNumber } from "utils/index";
import useTheme from "hooks/useTheme";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const labels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const BarChart = () => {
  const { isDarkMode, palette } = useTheme();

  const options = useMemo(() => getOptions(isDarkMode), [isDarkMode]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data: [10, 20, 30, 25, 40, 32, 20, 60, 50, 70, 50, 50],
          backgroundColor: isDarkMode ? "#616161" : "#F2EFFF",
          hoverBackgroundColor: palette.primary.main,
          borderRadius: 16,
          borderSkipped: false,
        },
      ],
    }),
    [isDarkMode, palette.primary.main],
  );

  return (
    <Box position="relative" sx={{ minHeight: 350, flex: 1 }}>
      <Box position="absolute" sx={{ width: "100%", height: "100%" }}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Bar options={options as any} data={data} />
      </Box>
    </Box>
  );
};

export default memo(BarChart);

const getOptions = (isDarkMode: boolean) => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Monthly Earning",
        position: "top",
        align: "start",
        padding: {
          top: 10,
          bottom: 30,
        },
        color: isDarkMode ? "#dcdde2" : "#BABCC6",
        font: {
          size: 14,
          lineHeight: 1.57,
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? "#3B3A39" : "#212121",
        usePointStyle: true,
        yAlign: "bottom",
        bodyFont: {
          size: 12,
          weight: "600",
        },
        callbacks: {
          title: () => "",
          label: (ctx) => ` ${formatNumber(ctx.parsed.y)}%`,
          labelTextColor: () => "#FFFFFF",
          labelPointStyle: () => {
            const image = new Image(14, 7);
            image.src = "/images/ic-trend.svg";
            return {
              pointStyle: image,
              rotation: 0,
            };
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawTicks: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: isDarkMode ? "#ECECF3" : undefined,
        },
      },
      y: {
        grid: {
          display: false,
          drawTicks: false,
        },
        border: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
  } as ChartProps["options"];
};
