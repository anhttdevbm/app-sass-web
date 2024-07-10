import { Dispatch, SetStateAction } from "react";
import { Stack, TableRow, TableCell, Collapse } from "@mui/material";
import { BodyCell } from "components/Table";
import { useState } from "react";
import { IconButton, Text } from "components/shared";
import MoreDotIcon from "icons/MoreDotIcon";
import {
  TBudgetService,
  budgetDetailRef,
} from "components/sn-budgeting/BudgetDetail";
import _ from "lodash";
import { NS_BUDGETING } from "constant/index";
import { useTranslations } from "next-intl";
import ChevronIcon from "icons/ChevronIcon";

interface ServiceAreaSectionRowProps {
  service: TBudgetService;
  setAnchorEl: Dispatch<SetStateAction<HTMLButtonElement | null>>;
  anchorEl: HTMLButtonElement | null;
}

function ServiceAreaSectionRow({
  service,
  anchorEl,
  setAnchorEl,
}: ServiceAreaSectionRowProps) {
  const budgetT = useTranslations(NS_BUDGETING);
  const [isCollapse, setIsCollapse] = useState(false);

  return (
    <>
      <TableRow
        sx={{
          td:{height:"40px"},
          "& > *": { borderBottom: "none !important" },
          minHeight: 100,
          width: "100%",
        }}
      >
        <BodyCell align="left">
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            width="100%"
            onClick={() => setIsCollapse(!isCollapse)}
            justifyContent="space-between"
          >
            <Text
              variant="body1"
              sx={{
                pointerEvents: "none",
                display: "block",
                wordBreak: "break-word",
                height: "fit-content",
                boxSizing: "border-box",
              }}
            >
              {service.name}
            </Text>
            <ChevronIcon
              sx={{
                color: "grey.300",
                transition: "all 0.3s ease-in-out",
              }}
              style={{
                transform: isCollapse ? "rotate(-180deg)" : "rotate(0deg)",
              }}
              fontSize="medium"
            />
          </Stack>
        </BodyCell>
        <BodyCell>{_.get(service, "estimate", 0)}</BodyCell>
        <BodyCell>${_.get(service, "price", 0)}</BodyCell>
        <BodyCell>${_.get(service, "tolBudget", 0)}</BodyCell>
        <BodyCell>
          <IconButton
            noPadding
            sx={{ transform: "translateX(-50%)" }}
            onClick={(e) => {
              if (Boolean(anchorEl)) {
                budgetDetailRef.current?.setSelectedServiceData(null);
                setAnchorEl(null);
              } else {
                budgetDetailRef.current?.setSelectedServiceData(service);
                setAnchorEl(e.currentTarget);
              }
            }}
          >
            <MoreDotIcon fontSize="medium" sx={{ color: "grey.300" }} />
          </IconButton>
        </BodyCell>
      </TableRow>
      <TableRow
        sx={{
          mb: 1,
        }}
      >
        <TableCell
          colSpan={1}
          sx={{
            transition: "all 0.3s ease-in-out",
            maxHeight: isCollapse ? "100%" : "0px",
            py: isCollapse ? "16px" : 0,
            pt: 0,
            pb: "10px",
          }}
        >
          <Collapse in={isCollapse} unmountOnExit>
            <Stack
              direction="column"
              sx={{
                width: "100%",
              }}
            >
              <Text variant="caption" color="grey.300">
                {budgetT("tabService.section.description")}
              </Text>
              <Text
                variant="body2"
                sx={{
                  wordBreak: "break-word",
                }}
              >
                {_.get(service, "desc", "")}
              </Text>
            </Stack>
          </Collapse>
        </TableCell>
        <TableCell
          colSpan={9}
          sx={{
            transition: "all 0.3s ease-in-out",
            maxHeight: isCollapse ? "100%" : "0px",
            py: isCollapse ? "16px" : 0,
            pt: 0,
            pb: "10px",
          }}
        ></TableCell>
      </TableRow>
    </>
  );
}

export default ServiceAreaSectionRow;
