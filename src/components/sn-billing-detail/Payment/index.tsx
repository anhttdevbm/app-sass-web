import { Box, Stack, Typography } from "@mui/material";
import { NS_BILLING, NS_COMMON } from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { memo, useEffect, useMemo, useState } from "react";
import { PaymentData } from "store/billing/actions";
import { useBillings } from "store/billing/selectors";
import "../Payment/PaymentTableHome/style.css";
import PaymentModal from "../components/PaymentModal";
import PaymentTable from "./PaymentTable";
import { formatDate, formatNumber } from "utils/index";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import { CURRENCY_CODE } from "constant/enums";
import DoughnutChartPayment from "../components/DoughnutChartPayment";
import { useInvoices } from "store/invoice/selectors";

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

  const {
    item: itemInvoice,
    paymentAll,
    onGetInvoiceDetail,
    onGetAllPayments,
  } = useInvoices();

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
    onGetInvoiceDetail(id);
  }, []);

  useEffect(() => {
    if (itemInvoice?.id) {
      onGetPayments(itemInvoice.id);
      onGetAllPayments(itemInvoice.id);
    }
  }, [itemInvoice]);

  useEffect(() => {
    if (
      itemInvoice?.id &&
      (isAddPayment || isUpdatePayment || isDeletedPayment)
    ) {
      onGetPayments(itemInvoice.id);
      onGetAllPayments(itemInvoice.id);
    }
  }, [isAddPayment, isUpdatePayment, isDeletedPayment]);

  // const dataPaid = useMemo(() => {
  //   let paidFirst = 0 as number;
  //   let leftToPayFirst = 0 as number;
  //   let leftToPayNew = 0 as number;
  //   let paidNew = 0 as number;

  //   if (dataPayment && dataPayment.length > 0 && item) {
  //     if (dataPayment?.length == 1) {
  //       if (dataPayment[0].status == "Paid") {
  //         paidFirst = dataPayment[0]?.amount ?? 0;
  //         leftToPayFirst =
  //           item.amount ?? 0 - paidFirst - (dataPayment[0]?.amount ?? 0);
  //       }
  //     }
  //     if (dataPayment?.length > 1) {
  //       paidNew = dataPayment?.reduce(
  //         (sum, e: PaymentData) =>
  //           e?.amount && e?.status == "Paid" ? sum + e?.amount : 0,
  //         0,
  //       );
  //       leftToPayNew = (item.amount ?? 0) - paidNew;
  //     }

  //     const sumDataPaid = dataPayment?.length == 1 ? paidFirst : paidNew;
  //     const sumLeftToPay = leftToPayFirst + leftToPayNew;

  //     return { paid: sumDataPaid, leftToPay: sumLeftToPay };
  //   } else {
  //     return 0;
  //   }
  // }, [dataPayment, item]);

  // const dataWriteOff = useMemo(() => {
  //   if (dataPayment && dataPayment?.length > 0 && item && dataPaid) {
  //     let leftToPay = 0 as number;
  //     const sumDataAmountWriteOff = dataPayment?.reduce(
  //       (sum, e: PaymentData) =>
  //         e?.amount && e?.status == "Writeoff" ? sum + e?.amount : 0,
  //       0,
  //     );

  //     if (sumDataAmountWriteOff == item?.amount ?? 0) {
  //       leftToPay = 0;
  //     }

  //     if (sumDataAmountWriteOff > (item?.amount ?? 0) && dataPaid) {
  //       leftToPay = (item?.amount ?? 0) - dataPaid.paid - sumDataAmountWriteOff;
  //     }

  //     return leftToPay;
  //   }
  // }, [item, dataPaid, dataPayment]);

  // const percentPaid = useMemo(() => {
  //   const sumAmountPaid = dataPayment?.reduce(
  //     (sum, e: PaymentData) =>
  //       e?.amount && e?.status == "Paid" ? sum + e?.amount : 0,
  //     0,
  //   );
  //   const data =
  //     item?.amount && sumAmountPaid
  //       ? Math.round((sumAmountPaid / item?.amount) * 100)
  //       : 0;
  //   return data;
  // }, [dataPayment, item]);

  // const percentLeftToPay = useMemo(() => {
  //   const sumAmountWriteOff = dataPayment?.reduce(
  //     (sum, e: PaymentData) =>
  //       e?.amount && e?.status == "Writeoff" ? sum + e?.amount : 0,
  //     0,
  //   );
  //   const data =
  //     item?.amount && sumAmountWriteOff
  //       ? Math.round((sumAmountWriteOff / item?.amount) * 100)
  //       : 0;
  //   return data;
  // }, [item, dataPayment]);

  // const totalOfWriteOff = useMemo(() => {
  //   const res = dataPayment?.reduce(
  //     (sum, e: PaymentData) =>
  //       e?.amount && e?.status == "Writeoff" ? sum + e?.amount : 0,
  //     0,
  //   );

  //   return res;
  // }, [item, dataPayment]);

  // const totalOfPaid = useMemo(() => {
  //   const res = dataPayment?.reduce(
  //     (sum, e: PaymentData) =>
  //       e?.amount && e?.status == "Paid" ? sum + e?.amount : 0,
  //     0,
  //   );

  //   return res;
  // }, [item, dataPayment]);

  // const totalOfWriteOff = useMemo(() => {
  //   const res = dataPayment?.reduce(
  //     (sum, e: PaymentData) =>
  //       e?.amount && e?.status == "Writeoff" ? sum + e?.amount : 0,
  //     0,
  //   );

  //   return res;
  // }, [item, dataPayment]);

  // const totalOfPaid = useMemo(() => {
  //   const res = dataPayment?.reduce(
  //     (sum, e: PaymentData) =>
  //       e?.amount && e?.status == "Paid" ? sum + e?.amount : 0,
  //     0,
  //   );

  //   return res;
  // }, [item, dataPayment]);

  return (
    <Stack mt={6} sx={{ overflowY: "auto", height: "60vh" }}>
      {/* <Stack gap={2} pb={2} pl={2}> */}
      {/* <Grid container spacing={2}> */}
      {/* <Grid xs={12} md={8} sx={{ borderRadius: "5px 0px 0px 5px" }}>
            <PaymentTableHome
              item={item}
              dataPaid={dataPaid ?? {}}
              dataWriteOff={dataWriteOff}
            />
          </Grid> */}
      {/* <Grid
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
        </Grid> */}
      {/* <Grid container spacing={2.1}>
          <Grid xs={12} md={8}></Grid>
          <Grid xs={12} md={4}></Grid>
        </Grid> */}
      {/* </Stack> */}
      <Stack spacing={8} direction="row">
        <Stack
          direction="column"
          width="290px"
          sx={{
            padding: "8px 16px 20px",
            boxShadow:
              "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
            borderRadius: "16px",
            height: "fit-content",
            gap: "10px",
          }}
          spacing={1}
        >
          <Typography fontSize={16} fontWeight={600}>
            General
          </Typography>
          <Stack direction="row" justifyContent="space-between">
            <Typography fontSize={14} fontWeight={700} color="#212529">
              Due date
            </Typography>
            <Typography fontSize={14} fontWeight={400} color="#212529">
              {formatDate(dataPayment?.dueDate)}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography fontSize={14} fontWeight={700} color="#212529">
              Total amount
            </Typography>
            <Typography fontSize={14} fontWeight={400} color="#212529">
              {formatNumber(dataPayment?.totalAmount ?? 0, {
                prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
                numberOfFixed: 2,
              })}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography fontSize={14} fontWeight={700} color="#212529">
              Payment made
            </Typography>
            <Typography fontSize={14} fontWeight={400} color="#212529">
              {formatNumber(dataPayment?.payment_made ?? 0, {
                prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
                numberOfFixed: 2,
              })}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography fontSize={14} fontWeight={700} color="#212529">
              Balance due
            </Typography>
            <Typography fontSize={14} fontWeight={400} color="#212529">
              {formatNumber(dataPayment?.balanceDue ?? 0, {
                prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
                numberOfFixed: 2,
              })}
            </Typography>
          </Stack>
        </Stack>

        <Stack>
          <DoughnutChartPayment
            amount={dataPayment?.totalAmount}
            balanceDue={dataPayment?.percentage?.per_balance}
            paid={dataPayment?.percentage?.paid}
            write={dataPayment?.percentage?.writeOff}
          />
        </Stack>

        <Stack direction="column" sx={{ width: "300px", gap: "16px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              borderBottom: "1px solid #D4D4D4",
              paddingLeft: "36px",
            }}
          >
            <Typography fontSize={14} fontWeight={700} color="#404040">
              Label
            </Typography>
            <Typography>%</Typography>
          </Stack>
          <Stack direction="row">
            <Box
              sx={{
                height: "12px",
                width: "14px",

                borderRadius: "50%",
                backgroundColor: "#14B8A6",
                margin: "auto 12px",
              }}
            />
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ width: "100%" }}
            >
              <Typography fontSize={14} fontWeight={700} color="#404040">
                Paid
              </Typography>
              <Typography fontSize={14} fontWeight={700} color="#404040">
                {Number(dataPayment?.percentage?.paid ?? 0).toFixed(2)} %
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row">
            <Box
              sx={{
                height: "12px",
                width: "14px",

                borderRadius: "50%",
                backgroundColor: "#D32F06",
                margin: "auto 12px",
              }}
            />

            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ width: "100%" }}
            >
              <Typography fontSize={14} fontWeight={700} color="#404040">
                Write off
              </Typography>
              <Typography fontSize={14} fontWeight={700} color="#404040">
                {Number(dataPayment?.percentage?.writeOff ?? 0).toFixed(2)} %
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row">
            <Box
              sx={{
                height: "12px",
                width: "14px",

                borderRadius: "50%",
                backgroundColor: "#F59E0B",
                margin: "auto 12px",
              }}
            />

            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ width: "100%" }}
            >
              <Typography fontSize={14} fontWeight={700} color="#404040">
                Balance due
              </Typography>
              <Typography fontSize={14} fontWeight={700} color="#404040">
                {Number(dataPayment?.percentage?.per_balance ?? 0).toFixed(2)} %
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Stack pb={2} mt={4}>
        <Box
          sx={{
            backgroundColor: "#D9F0FD",
            padding: "14px 0 14px 20px",
            borderRadius: "12px",
          }}
        >
          <Typography color="#0575E6" fontSize={20} fontWeight={600}>
            Payments detail{" "}
          </Typography>
        </Box>
        <PaymentTable
          handleOpen={handleOpen}
          dataPayment={paymentAll}
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
