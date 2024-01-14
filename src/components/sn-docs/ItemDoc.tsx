"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  TableRow,
} from "@mui/material";
import { BodyCell } from "components/Table";
import { Text } from "components/shared";
import useBreakpoint from "hooks/useBreakpoint";
import useTheme from "hooks/useTheme";
import DesktopCells from "./DesktopCells";
import MobileContentCell from "./MobileContentCell";
import styled from "@emotion/styled";

import axios from "axios";

export const RowGroup = (props) => {
  const { items, title } = props;
  
  const { isMdSmaller } = useBreakpoint();
  const { isDarkMode } = useTheme();
 

  return (
    <TableRow>
      <BodyCell align="left" padding="none" colSpan={4}>
        <StyledAccordion defaultExpanded={true}>
          <AccordionSummary
            sx={{ bgcolor: isDarkMode ? "grey.50" : "primary.light" }}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Text fontWeight={600} fontSize={14}>
              {title}
            </Text>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0, width: "100%" }}>
            {Array.isArray(items) &&
              items.map((doc) => {
                return (
                  <TableRow >
                    {!isMdSmaller ? (
                      <DesktopCells item={doc} />
                    ) : (
                      <MobileContentCell item={doc} />
                    )}
                  </TableRow>
                );
              })}
          </AccordionDetails>
        </StyledAccordion>
      </BodyCell>
    </TableRow>
  );
};

const StyledAccordion = styled(Accordion)(() => {
  const { isDarkMode } = useTheme();
  return {
    "&.MuiAccordion-root": {
      width: "100%",
      border: "none",
      borderBottom: "1px solid #2196f350",
      borderRadius: 0,
      boxShadow: "none",
      backgroundColor: isDarkMode ? "grey.50" : "primary.light",
    },
  };
});
