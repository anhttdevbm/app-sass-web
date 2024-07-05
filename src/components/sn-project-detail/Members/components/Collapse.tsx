import { memo } from "react";
import { Accordion, AccordionSummary, accordionClasses } from "@mui/material";
import ChevronIcon from "icons/ChevronIcon";
import { useSidebar } from "store/app/selectors";
import useBreakpoint from "hooks/useBreakpoint";
import useTheme from "hooks/useTheme";

type CollapseProps = {
  label: React.ReactNode;
  children: React.ReactNode;
  initCollapse?: boolean;
};

const Collapse = (props: CollapseProps) => {
  const { label, children, initCollapse = false } = props;

  const { isDarkMode } = useTheme();

  return (
    <Accordion
      defaultExpanded={initCollapse}
      sx={{
        backgroundColor: "transparent",
        backgroundImage: "none",
        boxShadow: "none",
        "&.Mui-expanded": {
          mx: 0,
          my: 1.5,
        },
        "&:before": {
          content: "none",
        },
        [`& .${accordionClasses.region}`]: {
          width: "100%",
        },
      }}
    >
      <AccordionSummary
        sx={{
          px: 2,
          // backgroundColor: { xs: "grey.50", sm: undefined },
          "&:hover, &.active": {
            backgroundColor: isDarkMode ? "grey.100" : "primary.light",
          },
          minHeight: "auto",
          "&.Mui-expanded": {
            minHeight: "auto",
            "& svg:last-child": {
              transform: "rotate(180deg)",
            },
          },
          "& div": {
            m: 0,
            "&.Mui-expanded": {
              m: 0,
            },
          },
        }}
        expandIcon={
          <ChevronIcon
            fontSize="medium"
            sx={{
              transform: "rotate(-90deg)",
              color: "grey.900",
            }}
          />
        }
      >
        {label}
      </AccordionSummary>
      {children}
    </Accordion>
  );
};

export default memo(Collapse);
