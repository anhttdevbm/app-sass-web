import { Link, Stack } from "@mui/material";
import { BodyCell } from "components/Table";
import { Button, Text } from "components/shared";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import { CURRENCY_CODE } from "constant/enums";
import { NS_COMMON } from "constant/index";
import { BILLING_DETAIL_PATH, BILLING_INFO_PATH } from "constant/paths";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { Billing } from "store/billing/reducer";
import { formatDate, formatNumber, getPath } from "utils/index";
import FolderIcon from "../../icons/FolderIcon";

type DesktopCellsProps = {
  item?: Billing;
  order: number;
  onOpenModalExport: (value: Billing) => void;
};

const DesktopCells = (props: DesktopCellsProps) => {
  const { item, order, onOpenModalExport } = props;
  const commonT = useTranslations(NS_COMMON);

  return (
    <>
      {/* <BodyCell align="center">{order}</BodyCell> */}
      <BodyCell
        align="center"
        href={getPath(BILLING_INFO_PATH, undefined, { id: item?.id ?? "" })}
      >
        <Text
          variant="body2"
          color="text.primary"
          fontWeight={600}
          lineHeight={1.28}
          sx={{
            "&:hover": { color: "primary.main" },
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            overflow: "hidden",
            wordBreak: "break-word",
            display: "-webkit-box",
            textOverflow: "ellipsis",
          }}
        >
          {item?.subject}
        </Text>
      </BodyCell>

      <BodyCell align="center" sx={{ paddingRight: 4 }}>
        {item?.invoiceNumber}
      </BodyCell>
      <BodyCell align="center" sx={{ paddingRight: 3 }}>
        {formatDate(item?.date)}
      </BodyCell>

      <BodyCell
        // href={getPath(PROJECT_TASKS_PATH, undefined, { id: item?.id })}
        align="center"
        sx={{ paddingRight: 3 }}
      >
        {item?.budget ? item?.budget[0]?.name : ""}
      </BodyCell>
      <BodyCell align="center" sx={{ paddingRight: 4 }}>
        <Button onClick={() => onOpenModalExport(item ?? {})}>
          <FolderIcon />
        </Button>
      </BodyCell>
      <BodyCell align="center" sx={{ paddingRight: 5 }}>
        {formatNumber(item?.amount, {
          prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
          numberOfFixed: 2,
        })}
      </BodyCell>
      <BodyCell align="center" sx={{ paddingRight: 5 }}>
        {formatNumber(item?.amount_unpaid, {
          prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
          numberOfFixed: 2,
        })}
      </BodyCell>
      <BodyCell align="center" sx={{ paddingRight: 16.5 }}>
        {formatDate(item?.dueDate)}
      </BodyCell>
    </>
  );
};

export default memo(DesktopCells);
