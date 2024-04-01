import Box from "@mui/material/Box";
import { useTranslations } from "next-intl";
import Image from "next/image";

import CostRateEmptyImage from "public/images/img-cost-rate-empty.png";
import { NS_COST_RATE } from "constant/index";
import { NewButton, Text } from "components/shared";
import AddCircleIcon from "icons/AddCircleIcon";
import useBreakpoint from "hooks/useBreakpoint";

type CostRateEmpty = {
  fullname?: string;
  isEditable?: boolean;
}

const CostRateEmpty = ({ fullname, isEditable = false }: CostRateEmpty) => {
  const costRateT = useTranslations(NS_COST_RATE);
  const { isSmSmaller } = useBreakpoint();

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" flexGrow={1}>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Image
          src={CostRateEmptyImage}
          alt="Cost Rate Empty Illustration"
          width={ isSmSmaller ? 200 : 320 }
        />
      </Box>
      <Text
        variant="h3"
        textAlign="center"
        fontSize={{
          xs: "20px",
          sm: "25px",
        }}
        fontWeight={600}
        pt={4}
      >
        <span style={{ color: "#045EB8" }}>{fullname}</span> {costRateT("empty.title")}
      </Text>
      <Text variant="h5" textAlign="center" fontSize="16px" fontWeight={400} pt={3} color="grey.700">{costRateT("empty.subtitle")}</Text>

      {
        isEditable
          ? <NewButton
            variant="primary"
            sx={{
              marginTop: {
                xs: "36px",
                sm: "20px",
              },
              marginBottom: {
                xs: "36px",
                sm: "64px",
              },
            }}
            startIcon={<AddCircleIcon />}
          >
            Add cost rate
          </NewButton>
          : <></>
      }
    </Box>
  )
};

export default CostRateEmpty;