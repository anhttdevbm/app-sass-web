import { Dispatch, SetStateAction, useMemo } from "react";
import {
  Stack,
  TableRow,
  TableCell,
  Collapse,
  Typography,
} from "@mui/material";
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
import useGetOptions from "store/billing/selectors";

interface ServiceAreaSectionRowProps {
  service: TBudgetService;
  setAnchorEl: Dispatch<SetStateAction<HTMLButtonElement | null>>;
  anchorEl: HTMLButtonElement | null;
}

enum BudgetServiceBillType {
  BILLABLE = "billable",
  NON_BILLABLE = "non_billable",
}

const billingBillable = {
  label: "Billable",
  value: "billable",
  color: "success.main",
  bgcolor: "success.light",
};

const billingNonBillable = {
  label: "Non Billable",
  value: "non_billable",
  color: "error.main",
  bgcolor: "error.light",
};

function ServiceAreaSectionRow({
  service,
  anchorEl,
  setAnchorEl,
}: ServiceAreaSectionRowProps) {
  const budgetT = useTranslations(NS_BUDGETING);
  const [isCollapse, setIsCollapse] = useState(false);
  const { positionOptions } = useGetOptions();

  const position = useMemo(() => {
    if (!service.serviceType) return "";
    const result = positionOptions.find(
      (item) => item.value === service.serviceType,
    );
    return result?.label || "";
  }, [positionOptions]);

  const billStatus = useMemo(() => {
    switch (_.get(service, "billType", "") as BudgetServiceBillType) {
      case BudgetServiceBillType.BILLABLE:
        return billingBillable;
      case BudgetServiceBillType.NON_BILLABLE:
        return billingNonBillable;
      default:
        return {};
    }
  }, [service]);

  return (
    <>
      <TableRow
        sx={{
          "& > *": { borderBottom: "none !important" },
          minHeight: 100,
          minWidth: {
            md: 1320,
            xs: 1320,
            overflow: "visible",
          },
          width: "100%",
        }}
      >
        <BodyCell
          align="left"
          sx={{
            cursor: "pointer",
            width: "350px !important",
            minWidth: "350px !important",
            maxWidth: "350px !important",
            overflow: "visible",
          }}
        >
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
        <BodyCell sx={{ minWidth: 60 }}>{position}</BodyCell>
        <BodyCell sx={{ minWidth: 120 }}>
          {!_.isEmpty(billStatus) && (
            <Typography
              sx={{
                bgcolor: _.get(billStatus, "bgcolor", "transparent"),
                color: _.get(billStatus, "color", "transparent"),
              }}
            >
              {_.get(billStatus, "label", "")}
            </Typography>
          )}
        </BodyCell>
        <BodyCell sx={{ minWidth: 60 }}>{_.get(service, "unit", "")}</BodyCell>
        <BodyCell sx={{ minWidth: 60 }}>
          {_.get(service, "estimate", 0)} pcs
        </BodyCell>
        <BodyCell sx={{ minWidth: 100 }}>
          ${_.get(service, "quantity", 0)} /day
        </BodyCell>
        <BodyCell sx={{ minWidth: 60 }}>{_.get(service, "price", 0)}h</BodyCell>
        <BodyCell sx={{ minWidth: 60 }}>
          {_.get(service, "discount", 0)} %
        </BodyCell>
        <BodyCell sx={{ minWidth: 100, overflow: "visible" }}>
          ${_.get(service, "tolBudget", 0)}
        </BodyCell>
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
