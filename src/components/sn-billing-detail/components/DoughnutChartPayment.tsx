import { Box, Stack, Typography } from "@mui/material";
import {
  ArcElement,
  ChartData,
  Chart as ChartJS,
  Color,
  Legend,
  Tooltip,
} from "chart.js";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import { CURRENCY_CODE } from "constant/enums";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { formatNumber } from "utils/index";

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

const DoughnutChartPayment = ({ write, paid, balanceDue, amount }) => {
  const [dataChart, setDataChart] = useState(data);
  useEffect(() => {
    const total = write + paid + balanceDue;
    if (!total) return;

    setDataChart((prev) => ({
      ...prev,
      datasets: [
        {
          ...prev.datasets[0],
          data: [
            (write * 100) / total,
            (paid * 100) / total,
            (balanceDue * 100) / total,
          ],
        },
      ],
    }));
  }, [write, paid, balanceDue]);
  return (
    <Box sx={{ position: "relative" }}>
      <Stack
        direction="column"
        sx={{
          position: "absolute",
          width: "210px",
          left: 0,
          right: 0,
          marginLeft: "auto",
          marginRight: "auto",
          top: "80px",
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
        <Typography
          color="#0A0A0A"
          fontSize={28}
          fontWeight={700}
          textAlign="center"
        >
          {formatNumber(Number(amount), {
            prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
            numberOfFixed: 2,
          })}
        </Typography>
      </Stack>
      <Doughnut
        height={210}
        width={210}
        options={options as any}
        data={dataChart}
      />
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
