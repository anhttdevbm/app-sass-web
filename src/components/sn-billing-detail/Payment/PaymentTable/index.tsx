import { TableRow } from "@mui/material";
import { BodyCell, CellProps, TableLayout } from "components/Table";
import { Text } from "components/shared";
import { NS_BILLING } from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";
import PencilUnderlineIcon from "icons/PencilUnderlineIcon";
import TrashIcon from "icons/TrashIcon";
import { useTranslations } from "next-intl";
import { memo, useMemo } from "react";
import { PaymentData } from "store/billing/actions";
import { Billing, Budgets } from "store/billing/reducer";
import DesktopCells from "./DesktopCells";
import MobileContentCell from "./MobileContentCell";

type IProps = {
  arrBudgets?: Budgets[];
  isEdit?: boolean;
  item?: Billing;
  handleOpen: (value: PaymentData) => void;
  dataPayment?: PaymentData[];
  onDeletePayment?: (id: string) => void;
};

const PaymentTable = (props: IProps) => {
  const { handleOpen, dataPayment, onDeletePayment } = props;

  const { isMdSmaller } = useBreakpoint();
  const billingT = useTranslations(NS_BILLING);

  const desktopHeaderList: CellProps[] = useMemo(
    () => [
      {
        value: `${billingT("detail.form.payment.table2.date")}`,
        align: "left",
        width: "15%",
      },
      {
        value: "Payment #",
        align: "left",
        width: "15%",
      },
      {
        value: `${billingT("detail.form.payment.table2.note")}`,
        align: "left",
        width: "15%",
      },
      {
        value: `${billingT("detail.form.payment.table2.status")}`,
        align: "left",
        width: "15%",
      },
      {
        value: `${billingT("detail.form.payment.table2.amount")}`,
        align: "left",
        width: "15%",
      },
    ],
    [billingT],
  );
  const mobileHeaderList: CellProps[] = useMemo(
    () => [
      {
        value: `${billingT("detail.form.payment.table2.date")}`,
        align: "left",
        width: "15%",
      },
      {
        value: "Payment #",
        align: "left",
        width: "15%",
      },
      {
        value: `${billingT("detail.form.payment.table2.note")}`,
        align: "left",
        width: "15%",
      },
      {
        value: `${billingT("detail.form.payment.table2.status")}`,
        align: "left",
        width: "15%",
      },
      {
        value: `${billingT("detail.form.payment.table2.amount")}`,
        align: "left",
        width: "15%",
      },
    ],
    [billingT],
  );

  const headerList = useMemo(() => {
    const additionalHeaderList = isMdSmaller
      ? mobileHeaderList
      : desktopHeaderList;
    return [
      ...additionalHeaderList,
      { value: "", width: "10%" },
    ] as CellProps[];
  }, [desktopHeaderList, isMdSmaller, mobileHeaderList]);

  const handleDeletePayment = (id: string) => {
    onDeletePayment?.(id);
  };
  return (
    <>
      <TableLayout
        headerList={headerList}
        headerProps={{
          sx: {
            px: { xs: 0.5, md: 2 },
            background: "#fff",
            borderBottom: "1px solid #EFEFEF",
          },
        }}
      >
        {dataPayment?.map((item, index) => {
          {
            /* //   const indexSelected = selectedList.findIndex(
          //     (selected) => selected?.id === item.id,
          //   ); */
          }
          return (
            <TableRow key={1}>
              {/* <BodyCell sx={{ pl: { xs: 0.5, md: 2 } }}>
            <Checkbox
              checked={indexSelected !== -1}
              onChange={onToggleSelect(item, indexSelected)}
            />
          </BodyCell> */}
              {isMdSmaller ? (
                <MobileContentCell item={item} />
              ) : (
                <DesktopCells
                  item={item}
                  order={0}
                  payment_number={String(index + 1)}
                />
              )}
              <BodyCell
                align="left"
                sx={{ px: { xs: 0.5, md: 2 }, display: "flex", gap: "12px" }}
              >
                <Text
                  fontSize={24}
                  variant={"body2"}
                  onClick={() => handleOpen(item)}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <PencilUnderlineIcon />
                </Text>
                <Text
                  variant={"body2"}
                  color={"red"}
                  fontSize={24}
                  onClick={() => handleDeletePayment(item?.id ?? "")}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <TrashIcon />
                </Text>
              </BodyCell>
            </TableRow>
          );
        })}
      </TableLayout>
    </>
  );
};
export default memo(PaymentTable);
