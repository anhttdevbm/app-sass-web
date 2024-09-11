import { Box, Stack, Typography } from "@mui/material";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import { CURRENCY_CODE } from "constant/enums";
import { NS_BILLING, NS_COMMON } from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { memo, useEffect, useState } from "react";
import { PaymentData } from "store/billing/actions";
import { useBillings } from "store/billing/selectors";
import { useInvoices } from "store/invoice/selectors";
import { formatDate, formatNumber } from "utils/index";
import "../Payment/PaymentTableHome/style.css";
import DoughnutChartPayment from "../components/DoughnutChartPayment";
import PaymentModal from "../components/PaymentModal";
import PaymentTable from "./PaymentTable";

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
      onGetAllPayments(itemInvoice.id);
    }
  }, [itemInvoice]);

  useEffect(() => {
    if (
      itemInvoice?.id &&
      (isAddPayment || isUpdatePayment || isDeletedPayment)
    ) {
      onGetAllPayments(itemInvoice.id);
    }
  }, [isAddPayment, isUpdatePayment, isDeletedPayment]);

  return (
    <Stack mt={6} sx={{ overflowY: "auto", height: "60vh" }}>
      <Stack spacing={8} direction="row">
        <Stack
          direction="column"
          width="290px"
          sx={{
            padding: "8px 16px 20px",
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 4px 4px 0px",
            borderRadius: "16px",
            height: "fit-content",
            gap: "10px",
            marginLeft: "2px !important",
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
            padding: "12px 20px",
            borderRadius: "12px",
          }}
        >
          <Typography color="#0575E6" fontSize={16} fontWeight={600}>
            Payments detail
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
