import { Box, Grid, Menu, MenuItem, Stack, TableRow } from "@mui/material";
import { BodyCell, CellProps, TableLayout } from "components/Table";
import { IconButton, Text } from "components/shared";
import { NS_BILLING, NS_COMMON } from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";
import { useTranslations } from "next-intl";
import { memo, useEffect, useMemo, useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PencilUnderlineIcon from "icons/PencilUnderlineIcon";
import TrashIcon from "icons/TrashIcon";
import PaymentModal from "../components/PaymentModal";
import PaymentTableHome from "./PaymentTableHome";
import PaymentTable from "./PaymentTable";
import { useBillings } from "store/billing/selectors";
import { useParams } from "next/navigation";
import { PaymentData } from "store/billing/actions";
import ProgressBar from "@ramonak/react-progress-bar";
import "../Payment/PaymentTableHome/style.css";
import zIndex from "@mui/material/styles/zIndex";

type TabProps = {
  title: string;
};

const options = ["Edit", "Delete"];

const ITEM_HEIGHT = 48;

const TabPayment = (props: TabProps) => {
  const { title } = props;

  const {
    item,
    dataPayment,
    isAddPayment,
    isUpdatePayment,
    isDeletedPayment,
    onGetPayments,
    onAddPayment,
    onDeletePayment,
    onUpdatePayment,
  } = useBillings();

  const { id } = useParams() as { id: string };
  const { isMdSmaller } = useBreakpoint();
  const commonT = useTranslations(NS_COMMON);
  const billingT = useTranslations(NS_BILLING);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rowSelected, setRowSelected] = useState<PaymentData>({});

  const handleOpen = (data: PaymentData) => {
    setRowSelected(data);
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    onGetPayments(id);
  }, []);

  useEffect(() => {
    if (isAddPayment || isUpdatePayment || isDeletedPayment) {
      onGetPayments(id);
    }
  }, [isAddPayment, isUpdatePayment, isDeletedPayment]);

  const dataPaid = useMemo(() => {
    let paidFirst = 0 as number;
    let leftToPayFirst = 0 as number;
    let leftToPayNew = 0 as number;
    let paidNew = 0 as number;

    if (dataPayment && dataPayment.length > 0 && item) {
      if (dataPayment?.length == 1) {
        if (dataPayment[0].status == "Paid") {
          paidFirst = dataPayment[0]?.amount ?? 0;
          leftToPayFirst =
            item.amount ?? 0 - paidFirst - (dataPayment[0]?.amount ?? 0);
        }
      }
      if (dataPayment?.length > 1) {
        paidNew = dataPayment?.reduce(
          (sum, e: PaymentData) =>
            e?.amount && e?.status == "Paid" ? sum + e?.amount : 0,
          0,
        );
        leftToPayNew = item.amount ?? 0 - paidNew;
      }

      const sumDataPaid = paidNew;
      const sumLeftToPay = leftToPayFirst + leftToPayNew;

      return { paid: sumDataPaid, leftToPay: sumLeftToPay };
    } else {
      return 0;
    }
  }, [dataPayment, item]);

  const dataWriteOff = useMemo(() => {
    if (dataPayment && dataPayment?.length > 0 && item && dataPaid) {
      let leftToPay = 0 as number;
      const sumDataAmountWriteOff = dataPayment?.reduce(
        (sum, e: PaymentData) =>
          e?.amount && e?.status == "Writeoff" ? sum + e?.amount : 0,
        0,
      );

      if (sumDataAmountWriteOff == item?.amount ?? 0) {
        leftToPay = 0;
      }

      if (sumDataAmountWriteOff > (item?.amount ?? 0) && dataPaid) {
        leftToPay = item?.amount ?? 0 - dataPaid.paid - sumDataAmountWriteOff;
      }

      return leftToPay;
    }
  }, [item, dataPaid, dataPayment]);

  const percentPaid = useMemo(() => {
    const sumAmountPaid = dataPayment?.reduce(
      (sum, e: PaymentData) =>
        e?.amount && e?.status == "Paid" ? sum + e?.amount : 0,
      0,
    );
    const data =
      item?.amount && sumAmountPaid
        ? Math.round((sumAmountPaid / item?.amount) * 100)
        : 0;
    return data;
  }, [dataPayment, item]);

  const percentLeftToPay = useMemo(() => {
    const sumAmountWriteOff = dataPayment?.reduce(
      (sum, e: PaymentData) =>
        e?.amount && e?.status == "Writeoff" ? sum + e?.amount : 0,
      0,
    );
    const data =
      item?.amount && sumAmountWriteOff
        ? Math.round((sumAmountWriteOff / item?.amount) * 100)
        : 0;
    return data;
  }, [item, dataPayment]);

  return (
    <Stack mt={6}>
      <Stack gap={2} pb={2} pl={2}>
        <Grid container spacing={2}>
          <Grid xs={12} md={8} sx={{ borderRadius: "5px 0px 0px 5px" }}>
            <PaymentTableHome
              item={item}
              dataPaid={dataPaid ?? {}}
              dataWriteOff={dataWriteOff}
            />
          </Grid>
          <Grid
            container
            xs={12}
            md={4}
            sx={{
              // background: "#1BC5BD",
              textAlign: "center",
              alignItems: "center",
              // borderRadius: "0px 5px 5px 0px",
              height: 40,
              zIndex: 2,
              position: "relative",
              right: "2px",
              width: "100%",
            }}
          >
            <ProgressBar
              completed={percentPaid}
              width="100%"
              height="40px"
              borderRadius="0px 5px 5px 0px"
              baseBgColor="#e95d5d"
              bgColor="#1BC5BD"
              labelAlignment="left"
              className="wrapper"
              customLabel={billingT("detail.form.payment.table.paid")}
              // barContainerClassName=""
              // completedClassName=""
              customLabelStyles={{
                fontWeight: 400,
                fontSize: "16px",
                zIndex: 1,
                position: "absolute",
              }}
            />
            <Text
              sx={{
                zIndex: 1,
                position: "absolute",
                color: "#fff",
                right: "2px",
              }}
            >
              {billingT("detail.form.payment.table.leftToPay")}
            </Text>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              p={"2px 5px"}
              borderBottom={"1px solid #ECECF3"}
              alignItems={"center"}
              height={49}
              width={"100%"}
              color={"#666666"}
            >
              <Text
                sx={{
                  fontSize: "14px",
                  color: "#666",
                }}
              >
                {percentPaid}%
              </Text>
              <Text
                sx={{
                  fontSize: "14px",
                  color: "#666",
                }}
              >
                {percentLeftToPay}%
              </Text>
            </Stack>
          </Grid>
        </Grid>
        {/* <Grid container spacing={2.1}>
          <Grid xs={12} md={8}></Grid>
          <Grid xs={12} md={4}></Grid>
        </Grid> */}
      </Stack>
      <Stack gap={2} pb={2}>
        <PaymentTable
          handleOpen={handleOpen}
          dataPayment={dataPayment}
          onDeletePayment={onDeletePayment}
        />
      </Stack>
      <PaymentModal
        open={isOpen}
        handleClose={handleClose}
        title={billingT("detail.form.payment.title.editPayment")}
        action="update"
        dataUpdate={rowSelected}
      />
    </Stack>
  );
};
export default memo(TabPayment);
