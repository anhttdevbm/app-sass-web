import { CheckBox } from "@mui/icons-material";
import { Grid, Stack, TextField, Typography } from "@mui/material";
import FormLayout from "components/FormLayout";
import { DatePicker, Input, Select } from "components/shared";
import Textarea from "components/sn-time-tracking/Component/Textarea";
import { NS_BILLING, NS_COMMON } from "constant/index";
import dayjs from "dayjs";
import { FormikErrors, useFormik } from "formik";
import { useTranslations } from "next-intl";
import { memo, useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { BillPaymentData, PaymentData } from "store/billing/actions";
import { useBillings } from "store/billing/selectors";
import * as Yup from "yup";
import DropdownButton from "./DropdownButton";
import { useInvoices } from "store/invoice/selectors";
import { log } from "console";

type Iprops = {
  open: boolean;
  handleClose: () => void;
  title?: string;
  action?: string;
  dataUpdate?: PaymentData;
};
const BillModal = (props: Iprops) => {
  const { handleClose, open, title, dataUpdate } = props;
  const {
    item,
    onAddPayment,
    onUpdatePayment,
    isAddPayment,
    isDeletedPayment,
    isUpdatePayment,
  } = useBillings();

  const { item: itemInvoice } = useInvoices();
  const commonT = useTranslations(NS_COMMON);
  const billingT = useTranslations(NS_BILLING);
  const currentDate = dayjs().format("DD/MM/YYYY");
  const [action, setAction] = useState({ type: "add", value: "paid" });
  const handleOpen = (value) => {
    setAction((prev) => ({ ...prev, value }));
  };
  const formik = useFormik<PaymentData>({
    enableReinitialize: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues: {
      status: true,
      paid_on: "",
      amount: undefined,
      note: "",
      payment_number: "A11",
    },
    validationSchema: Yup.object().shape({
      amount: Yup.string().trim().required("Amount is Required"),
      paid_on: Yup.string().required("Paid on is required"),
    }),
    onSubmit: (value) => {
      const data = { ...value, status: action.value === "paid" ? true : false };
      if (action.type === "add") {
        onAddPayment(itemInvoice?.id ?? "", data);
        handleClose();
      } else {
        onUpdatePayment(itemInvoice?.id ?? "", data);
        handleClose();
      }
    },
  });

  const touchedErrors = useMemo(() => {
    return Object.entries(formik.errors).reduce(
      (out: FormikErrors<BillPaymentData>, [key, error]) => {
        // if (formik.touched[key]) {
        out[key] = error;
        // }
        return out;
      },
      {},
    );
  }, [formik.touched, formik.errors]);

  useEffect(() => {
    if (dataUpdate && Object.keys(dataUpdate).length > 0) {
      setAction({
        type: "update",
        value: dataUpdate.status ? "paid" : "write",
      });
      formik.setValues(dataUpdate);
    }
  }, [dataUpdate]);

  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  const onChangeDate = (name: string, newDate?: Date) => {
    formik.setFieldValue(name, newDate ? newDate : null);
    formik.setFieldTouched(name, true);

    // Fix validate failed when change network
    // let timeout: NodeJS.Timeout | null = null;
    // if (timeout) clearTimeout(timeout);
    // timeout = setTimeout(() => {
    //   formik.validateForm();
    // }, 50);
  };
  return (
    <FormLayout
      sx={{
        minWidth: { xs: "calc(100vw - 24px)", lg: 600 },
        maxWidth: { xs: "calc(100vw - 24px)", sm: 600 },
        minHeight: "auto",
      }}
      open={open}
      label={title}
      submitText="Add payment"
      cancelText={commonT("form.cancel")}
      onClose={handleClose}
      onSubmit={formik.handleSubmit}

      //   submitting={isFetching}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction={"row"} gap={2} pt={2} pb={2}>
            <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
              <Typography color="#4D4D4D" fontSize="14px" fontWeight={700}>
                Amount
              </Typography>
              <Input
                isSeparateError={true}
                // title={billingT("detail.form.payment.title.amount")}
                name="amount"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values?.amount}
                error={formik.errors?.amount}
                // error={commonT(touchedErrors?.amount, {
                //   name: commonT("form.title.amount"),
                // })}
                fullWidth
                rootSx={sxConfig.input}
                sx={{
                  flex: 1,
                  mt: { xs: 2, sm: 0 },
                  backgroundColor: "#F9F1F169",
                  borderRadius: "100px",
                  border: "1px solid #EFEFEF",
                }}
                onlyContent
              />
            </Stack>

            <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
              <Typography color="#4D4D4D" fontSize="14px" fontWeight={700}>
                Paid on
              </Typography>
              <DatePicker
                isSeparateError={true}
                name="paid_on"
                onChange={onChangeDate}
                onBlur={formik.handleBlur}
                value={formik.values?.paid_on}
                error={formik.errors?.paid_on}
                rootSx={sxConfig.input}
                fullWidth
                sx={{
                  mt: { xs: 2, sm: 0 },
                  backgroundColor: "#F9F1F169",
                  borderRadius: "100px",
                  border: "1px solid #EFEFEF",
                }}
                onlyContent
              />
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
            <Typography color="#4D4D4D" fontSize="14px" fontWeight={700}>
              Payment type
            </Typography>
            <DropdownButton
              handleOpen={handleOpen}
              selectedOps={formik.values.status ? 0 : 1}
            />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack direction={"row"} gap={2} pb={2}>
            <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
              <Typography color="#4D4D4D" fontSize="14px" fontWeight={700}>
                Note
              </Typography>
              <Input
                // title={billingT("detail.form.payment.title.note")}
                name="note"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values?.note}
                // error={commonT(touchedErrors?.description, {
                //   name: commonT("form.title.description"),
                // })}
                fullWidth
                rootSx={sxConfig.input}
                sx={{
                  mt: { xs: 2, sm: 0 },
                  backgroundColor: "#F9F1F169",
                  borderRadius: "24px",
                  border: "1px solid #EFEFEF",
                }}
                onlyContent
              />
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </FormLayout>
  );
};
const sxConfig = {
  input: {
    height: 56,
  },
};
export default memo(BillModal);
