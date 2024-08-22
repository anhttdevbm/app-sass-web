import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { IViewDocItem } from "../KanbanViewDocList";
import { Avatar, Box } from "@mui/material";
import { useState } from "react";
import BasicViewExpandItem from "../BasicViewExpandItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `0px ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary {...props} />
))(({ theme }) => ({
  height: "57px",
  borderRadius: "12px",
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: 0,
}));

export default function BasicViewDocItem({
  data,
  keyExpanded,
}: {
  data: IViewDocItem;
  keyExpanded: number | string;
}) {
  const [expanded, setExpanded] = useState<string | false>(
    `panel${data.group_by ?? keyExpanded}`,
  );

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <Box sx={{ marginY: 0.2 }}>
      <Accordion
        expanded={expanded === `panel${data.group_by ?? keyExpanded}`}
        onChange={handleChange(`panel${data.group_by ?? keyExpanded}`)}
      >
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          sx={{
            bgcolor: data.groupInfo ? "#14B9E5" : "#D9F0FD",
            color: data.groupInfo ? "common.white" : "grey.400",
            fontWeight: 600,
          }}
          aria-controls={`panel${data.group_by ?? keyExpanded}-content`}
          id={`panel${data.group_by ?? keyExpanded}-header`}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            {data.groupInfo ? (
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar
                  sx={{ height: 25, width: 25 }}
                  alt={data?.groupInfo.avatar.name}
                  src={data?.groupInfo.avatar.link}
                />
                <Typography>
                  {data.groupInfo.name}
                   {/* #{data.groupInfo.number ?? 0} */}
                </Typography>
              </Box>
            ) : (
              <Typography>No Project</Typography>
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {data.docs.map((item) => (
            <BasicViewExpandItem expandedItem={item} key={item._id} />
          ))}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
