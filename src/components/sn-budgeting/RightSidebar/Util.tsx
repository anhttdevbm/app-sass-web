import { Box } from "@mui/material";
import { Text } from "components/shared";
import { PropsWithChildren } from "react";

export const accordionSx = {
  "& .MuiAccordionSummary-root": { m: 0, minHeight: "32px !important" },
  "& .MuiAccordionSummary-content": { m: 0, minHeight: "32px !important" },
  "& .MuiAccordion-root": { m: 0, boxShadow: "none" },
  "& .MuiAccordion-root:before": { display: "none" },
};

export const BoxData = ({
  title,
  mb = 2,
  children,
}: PropsWithChildren<{ title: string; mb?: string | number }>) => {
  return (
    <Box mb={mb}>
      <Text fontSize="small" sx={{ color: "grey.400" }}>
        {title}
      </Text>
      <Text fontWeight="bold" sx={{ color: "grey.400" }}>
        {children}
      </Text>
    </Box>
  );
};
