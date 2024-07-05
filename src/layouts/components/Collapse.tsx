import { memo, useMemo } from "react";
import {
  Box,
  Accordion,
  AccordionSummary,
  Stack,
  accordionSummaryClasses,
  accordionClasses,
} from "@mui/material";
import { Text } from "components/shared";
import ChevronIcon from "icons/ChevronIcon";
import { useSidebar } from "store/app/selectors";
import useBreakpoint from "hooks/useBreakpoint";
import { useTranslations } from "next-intl";
import { NS_LAYOUT } from "constant/index";
import useTheme from "hooks/useTheme";

type CollapseProps = {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  initCollapse?: boolean;
};

const Collapse = (props: CollapseProps) => {
  const { label, icon, children, initCollapse = false } = props;
  const t = useTranslations(NS_LAYOUT);

  const { isDarkMode } = useTheme();

  const { isExpandedSidebar } = useSidebar();
  const { isLgSmaller, isSmSmaller } = useBreakpoint();

  const isShowLarge = useMemo(
    () => isExpandedSidebar && !isLgSmaller,
    [isExpandedSidebar, isLgSmaller],
  );

  return (
    <Accordion
      defaultExpanded={initCollapse}
      sx={{
        backgroundColor: "transparent",
        backgroundImage: "none",
        boxShadow: "none",
        "&.Mui-expanded": {
          mx: 0,
          my: { xs: 1, xl: 1.5 },
          "&:first-of-type": {
            mt: { xs: 1, xl: 1.5 },
          },
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
          px: isShowLarge || isSmSmaller ? { xs: 1.5, xl: 2.5 } : 1,
          py: isShowLarge || isSmSmaller ? { xs: 1, xl: 1.5 } : 1,
          borderRadius: 1,
          backgroundColor: "transparent",
          // backgroundColor: {
          //   xs: isDarkMode ? "background.default" : "grey.50",
          //   sm: undefined,
          // },
          "&:hover, &.active": {
            backgroundColor: isDarkMode ? "grey.50" : "primary.light",
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
            sx={{
              transform: "rotate(-90deg)",
              color: "grey.900",
            }}
          />
        }
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{
            "& svg:first-of-type": {
              fontSize: 24,
            },
          }}
        >
          {icon}
          {(isShowLarge || isSmSmaller) && (
            <Text
              color="grey.400"
              variant={{ xs: "body2", xl: "body1" }}
              noWrap
              textTransform="capitalize"
            >
              {t(label)}
            </Text>
          )}
        </Stack>
      </AccordionSummary>
      {children}
    </Accordion>
  );
};

export default memo(Collapse);
