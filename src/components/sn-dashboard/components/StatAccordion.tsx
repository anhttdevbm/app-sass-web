import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

interface Props {
  summaryChild: React.ReactNode
  children?: React.ReactNode
}

function StatAccordion({ summaryChild, children }: Props) {
  return (
    <Stack width='100%'>
      <Accordion
        elevation={0}
        sx={{
          boxShadow: "0px 6px 20px -4px rgba(0, 0, 0, 0.08)",
          borderRadius: "12px",
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          {summaryChild}
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    </Stack>
  )
}

export { StatAccordion }
