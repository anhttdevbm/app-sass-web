import { Box } from "@mui/material";

import { Text } from "components/shared";
import { useCostRate } from "store/costRate/selectors";

const CostRateInfo = () => {
  const { currentRate } = useCostRate();

  return (
    <Box
      border={1}
      borderColor="divider"
      borderRadius={6}
    >
      <Text><strong>id:</strong> {currentRate?.id}</Text>
      <Text><strong>company:</strong> {currentRate?.company}</Text>
      <Text><strong>cost_per_month:</strong> {currentRate?.cost_per_month}</Text>
      <Text><strong>currency:</strong> {currentRate?.currency}</Text>
      <Text><strong>type:</strong> {currentRate?.type}</Text>
      <Text><strong>start_date:</strong> {currentRate?.start_date}</Text>
      <Text><strong>end_date:</strong> {currentRate?.end_date}</Text>
      <Text><strong>is_active:</strong> {currentRate?.is_active}</Text>
      <Text><strong>holiday_calendar:</strong> {currentRate?.holiday_calendar}</Text>
      <Text><strong>working_hours:</strong> {currentRate?.working_hours}</Text>
      <Text><strong>total_hours:</strong> {currentRate?.total_hours}</Text>
      <Text><strong>created_by:</strong> {currentRate?.created_by}</Text>
      <Text><strong>created_time:</strong> {currentRate?.created_time}</Text>
    </Box>
  )
}

export default CostRateInfo;
