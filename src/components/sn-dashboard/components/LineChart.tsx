import { Box, Stack } from "@mui/material"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartType,
  ChartData,
  ScriptableContext,
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const labels = ["S", "M", "T", "W", "T", "F", "S"]

const getGradientBackground = (context: ScriptableContext<ChartType>, startColor: string, endColor: string) => {
  const chart = context.chart
  const { ctx, chartArea } = chart

  if (!chartArea) return startColor

  const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0)
  gradient.addColorStop(0, startColor)
  gradient.addColorStop(1, endColor)

  return gradient
}

const mockData: ChartData<"line"> = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: [1, 2, 1, 3, 1, 2, 1.5],
      borderColor: (ctx) => getGradientBackground(ctx, "#2AF598", "#009EFD"),
      borderWidth: 3,
    },
  ],
}

const options: ChartOptions<"line"> = {
  aspectRatio: 3,
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      border: {
        color: "#ECECF3",
      },
      grid: {
        display: false,
      },
      ticks: {
        stepSize: 1
      }
    },
    x: {
      border: {
        display: false,
      },
      grid: {
        drawTicks: false,
        color: "#ECECF3",
      },
      ticks: {
        color: "#1BC5BD",
      },
    },
  },
  elements: {
    line: {
      tension: 0.4, // disables bezier curves
    },
    point: {
      pointStyle: false,
    },
  },
}

function LineChart() {
  return (
    <Stack borderRadius={1.2} bgcolor='#F6F6FB' padding={2}>
      <Line options={options} data={mockData} />
    </Stack>
  )
}

export default LineChart
