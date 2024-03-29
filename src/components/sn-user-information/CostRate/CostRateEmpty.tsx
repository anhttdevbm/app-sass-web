import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";

import CostRateEmptyImage from "public/images/img-cost-rate-empty.png";
import { NS_COST_RATE } from "constant/index";
import { Text } from "components/shared";

const CostRateEmpty = ({ fullname }) => {
  const costRateT = useTranslations(NS_COST_RATE);

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Box display="flex" justifyContent="center" alignItems="center">
        <Image src={CostRateEmptyImage} alt="Cost Rate Empty Illustration" width={320} />
      </Box>
      <Text variant="h3" textAlign="center" fontSize="25px" fontWeight={600} pt={4}><span style={{ color: "#045EB8" }}>{fullname}</span> {costRateT("empty.title")}</Text>
      <Text variant="h5" textAlign="center" fontSize="16px" fontWeight={400} pt={3} color="grey.700">{costRateT("empty.subtitle")}</Text>
    </Box>
  )
};

export default CostRateEmpty;