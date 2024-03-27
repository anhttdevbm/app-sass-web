import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Text } from "components/shared";
import Link from "components/Link";
import { BoxData, accordionSx } from "./Util";
import { TBudget } from "store/project/budget/action";
import moment from "moment";

interface HomeTabProps {
  budget: TBudget;
}

export const HomeTab = ({ budget }: HomeTabProps) => {
  const {
    name,
    owner,
    company,
    subsidiary,
    currency,
    budget_number,
    start_date,
  } = budget;
  const { fullname } = owner;
  return (
    <Box mt={2} sx={accordionSx}>
      <Accordion defaultExpanded={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Text fontWeight="bold" sx={{ fontSize: "18px", color: "black" }}>
            General
          </Text>
        </AccordionSummary>
        <AccordionDetails>
          <BoxData title="Budget name">{name}</BoxData>
          <BoxData title="Owner">{fullname}</BoxData>
          <BoxData title="Company">{company}</BoxData>
          <BoxData title="Subsidiary">{subsidiary}</BoxData>
          <Link href="#" underline="none">
            <Text sx={{ color: "secondary.main" }}>Edit</Text>
          </Link>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Text fontWeight="bold" sx={{ fontSize: "18px", color: "black" }}>
            Detail
          </Text>
        </AccordionSummary>
        <AccordionDetails>
          <BoxData mb={0.5} title="Budget number">
            #{budget_number}
          </BoxData>
          <BoxData mb={0.5} title="Date">
            {moment(start_date).format("D MMM, YYYY")}
          </BoxData>
          <BoxData mb={0.5} title="Currency">
            {currency}
          </BoxData>
          <Link href="#" underline="none">
            <Text sx={{ color: "secondary.main" }}>Edit</Text>
          </Link>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Text fontWeight="bold" sx={{ fontSize: "18px", color: "black" }}>
            Project
          </Text>
        </AccordionSummary>
        <AccordionDetails>
          <BoxData mb={0.5} title="Project">
            Internal project [SAMPLE]
          </BoxData>
          <Link href="#" underline="none">
            <Text sx={{ color: "secondary.main" }}>
              Move to another project
            </Text>
          </Link>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
