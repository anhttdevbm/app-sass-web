import { Collapse, Stack, TableCell, TableRow } from "@mui/material";
import { BodyCell, StatusCell } from "components/Table";
import { Text } from "components/shared";
import useGetOptions from "components/sn-resource-planing/hooks/useGetOptions";
import {
  COLOR_BILL_TYPE,
  SALE_BILL_TYPE_LABEL,
} from "components/sn-sales-detail/helpers";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import { CURRENCY_CODE } from "constant/enums";
import { NS_SALES } from "constant/index";
import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Service } from "store/sales/reducer";
import { useSaleDetail } from "store/sales/selectors";
import { formatNumber } from "utils/index";
import DescriptionRow from "./DescriptionRow";
import { ChevronRight } from "@mui/icons-material";
import ChevronIcon from "icons/ChevronIcon";
import { ALIGN_CELL } from "components/sn-sales-detail/hooks/useGetHeaderColumn";

interface IProps {
  index: number;
  sectionKey: string;
  service: Service;
  sectionIndex: number;
}

const ServiceItem = ({ service, index, sectionIndex, sectionKey }: IProps) => {
  const {
    register,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { saleDetail } = useSaleDetail();
  const currency = saleDetail?.currency;
  const saleT = useTranslations(NS_SALES);
  const { positionOptions } = useGetOptions();

  const [billType, unit, qty, price, discount, tolBudgetForm] = useWatch({
    control,
    name: [
      `${sectionKey}.${index}.billType`,
      `${sectionKey}.${index}.unit`,
      `${sectionKey}.${index}.qty`,
      `${sectionKey}.${index}.price`,
      `${sectionKey}.${index}.discount`,
      `${sectionKey}.${index}.tolBudget`,
    ],
  });

  const position = useMemo(() => {
    if (!service.serviceType) return "";
    const result = positionOptions.find(
      (item) => item.value === service.serviceType,
    );
    return result?.label || "";
  }, [positionOptions]);

  const tolBuget = useMemo(() => {
    // if (typeof service.tolBudget !== "number") {
    //   return parseFloat(service.tolBudget);
    // }
    const result = qty * price * (1 - discount / 100);
    setValue(`${sectionKey}.${index}.tolBudget`, result.toFixed(2));
    return result;
  }, [tolBudgetForm, qty, price, unit, discount]);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "none" }, h: "100%" }}>
        <BodyCell
          align="left"
          sx={{
            cursor: "pointer",
            borderBottom: 0,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            width="100%"
            onClick={() => setIsCollapsed(!isCollapsed)}
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
                transform: isCollapsed ? "rotate(-180deg)" : "rotate(0deg)",
              }}
              fontSize="medium"
            />
          </Stack>
        </BodyCell>
        <BodyCell align="center">
          <Text variant="body2">{position}</Text>
        </BodyCell>
        <BodyCell>
          <StatusCell
            sx={{
              [`&.MuiTableCell-body`]: {
                borderBottom: "none",
                height: "fit-content",
              },
              [`&.MuiTableCell-root`]: {
                display: "flex",
                borderBottom: "none",
                alignItems: "center",
                justifyContent: "start",
                padding: 0,
                maxWidth: "fill-available!important",
                minWidth: "auto!important",
              },
              padding: 0,
              width: "100%",
              [`&.MuiSvgIcon-root`]: {
                display: "none",
              },
            }}
            text={SALE_BILL_TYPE_LABEL[service.billType]}
            textProps={{
              sx: {
                width: "100%",
              },
            }}
            color={COLOR_BILL_TYPE[service.billType]}
            namespace={NS_SALES}
          />
        </BodyCell>
        <BodyCell align={ALIGN_CELL}>
          <Text variant="body2">{saleT(`detail.service.unit.${unit}`)}</Text>
        </BodyCell>
        <BodyCell align={ALIGN_CELL}>
          <Text
            variant="body2"
            sx={{
              pointerEvents: "none",
              display: "block",
              wordBreak: "break-word",
              height: "fit-content",
              boxSizing: "border-box",
            }}
          >
            {`${service.estimate || 0}h`}
          </Text>
        </BodyCell>

        <BodyCell align={ALIGN_CELL}>
          <Text
            variant="body2"
            sx={{
              pointerEvents: "none",
              display: "block",
              wordBreak: "break-word",
              height: "fit-content",
              boxSizing: "border-box",
            }}
          >
            {formatNumber(
              typeof service.qty === "string"
                ? parseInt(service.qty)
                : service.qty,
              { suffix: "pcs" },
            )}
          </Text>
        </BodyCell>
        <BodyCell align={ALIGN_CELL}>
          <Text
            variant="body2"
            sx={{
              pointerEvents: "none",
              display: "block",
              wordBreak: "break-word",
              height: "fit-content",
              boxSizing: "border-box",
            }}
          >
            {formatNumber(
              typeof service.price === "string"
                ? parseInt(service.price)
                : service.price,
              {
                prefix: CURRENCY_SYMBOL[currency as CURRENCY_CODE] || "",
                suffix: `/${saleT(
                  `detail.service.unit.${unit}`,
                ).toLowerCase()}`,
                numberOfFixed: 2,
              },
            )}
          </Text>
        </BodyCell>
        <BodyCell align={ALIGN_CELL}>
          <Text
            variant="body2"
            sx={{
              pointerEvents: "none",
              display: "block",
              wordBreak: "break-word",
              height: "fit-content",
              boxSizing: "border-box",
            }}
          >
            {formatNumber(
              typeof service.discount === "string"
                ? parseInt(service.discount)
                : service.discount,
              {
                suffix: "%",
              },
            )}
          </Text>
        </BodyCell>
        <BodyCell align={ALIGN_CELL}>
          <Text
            variant="body2"
            sx={{
              pointerEvents: "none",
              display: "block",
              wordBreak: "break-word",
              height: "fit-content",
              boxSizing: "border-box",
            }}
          >
            {formatNumber(tolBuget, {
              numberOfFixed: 2,
              prefix: CURRENCY_SYMBOL[currency as CURRENCY_CODE],
            })}
          </Text>
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
            maxHeight: isCollapsed ? "100%" : "0px",
            py: isCollapsed ? "16px" : 0,
            pt: 0,
            pb: "10px",
          }}
        >
          <Collapse in={isCollapsed} unmountOnExit>
            <DescriptionRow content={service.desc} />
          </Collapse>
        </TableCell>
        <TableCell
          colSpan={9}
          sx={{
            transition: "all 0.3s ease-in-out",
            maxHeight: isCollapsed ? "100%" : "0px",
            py: isCollapsed ? "16px" : 0,
            pt: 0,
            pb: "10px",
          }}
        ></TableCell>
      </TableRow>
    </>
  );
};

export default ServiceItem;
