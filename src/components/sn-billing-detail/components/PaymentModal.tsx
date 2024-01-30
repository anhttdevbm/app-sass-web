import { CheckBox } from "@mui/icons-material";
import { Grid, Stack, TextField } from "@mui/material";
import FormLayout from "components/FormLayout";
import { Input, Select } from "components/shared";
import Textarea from "components/sn-time-tracking/Component/Textarea";
import { NS_BILLING, NS_COMMON } from "constant/index";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { memo, useEffect } from "react";
import { Controller } from "react-hook-form";
import { BillPaymentData, PaymentData } from "store/billing/actions";
import { useBillings } from "store/billing/selectors";

type Iprops = {
  open: boolean;
  handleClose: () => void;
  title?: string;
  action?: string;
  dataUpdate?: PaymentData;
};
const BillModal = (props: Iprops) => {
  const { handleClose, open, title, action, dataUpdate } = props;
  const {
    item,
    onAddPayment,
    onUpdatePayment,
    isAddPayment,
    isDeletedPayment,
    isUpdatePayment,
  } = useBillings();
  const commonT = useTranslations(NS_COMMON);
  const billingT = useTranslations(NS_BILLING);
  const currentDate = dayjs().format("DD/MM/YYYY");

  const formik = useFormik<BillPaymentData>({
    enableReinitialize: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues: {
      status: "Paid",
    },
    // validationSchema: {},
    onSubmit: (value) => {
      if (action == "add") {
        const data = {
          ...value,
          bill_id: item?.id,
        } as BillPaymentData;

        onAddPayment(data);
        handleClose();
      } else if (action == "write") {
        const data = {
          ...value,
          status: "Writeoff",
          bill_id: item?.id,
        } as BillPaymentData;

        onAddPayment(data);
        handleClose();
      } else {
        const data = {
          amount: value?.amount,
          date: value?.date,
          note: value?.note,
        } as BillPaymentData;

        onUpdatePayment(value?.id ?? "", data);
        handleClose();
      }
    },
  });

  useEffect(() => {
    if (dataUpdate && Object.keys(dataUpdate).length > 0) {
      formik.setValues(dataUpdate);
    }
  }, [dataUpdate]);

  return (
    <FormLayout
      sx={{
        minWidth: { xs: "calc(100vw - 24px)", lg: 600 },
        maxWidth: { xs: "calc(100vw - 24px)", sm: 600 },
        minHeight: "auto",
      }}
      open={open}
      label={title}
      submitText={
        action == "add" || action == "write"
          ? commonT("form.save")
          : billingT("detail.form.payment.button.updatePayment")
      }
      cancelText={commonT("form.cancel")}
      onClose={handleClose}
      onSubmit={formik.handleSubmit}
      //   submitting={isFetching}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction={"row"} gap={2} pt={2}>
            <Input
              title={billingT("detail.form.payment.title.amount")}
              name="amount"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.amount}
              // error={commonT(touchedErrors?.amount, {
              //   name: commonT("form.title.amount"),
              // })}
              fullWidth
              rootSx={sxConfig.input}
              sx={{ flex: 1, mt: { xs: 2, sm: 0 } }}
            />
            <Input
              title={billingT("detail.form.payment.title.paidOn")}
              // name="status"
              // onChange={formik.handleChange}
              // onBlur={formik.handleBlur}
              value={currentDate}
              disabled
              // error={commonT(touchedErrors?.description, {
              //   name: commonT("form.title.description"),
              // })}
              fullWidth
              rootSx={sxConfig.input}
              sx={{ flex: 1, mt: { xs: 2, sm: 0 } }}
            />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack direction={"row"} gap={2} pb={2}>
            <Input
              title={billingT("detail.form.payment.title.note")}
              name="note"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.note}
              // error={commonT(touchedErrors?.description, {
              //   name: commonT("form.title.description"),
              // })}
              fullWidth
              rootSx={sxConfig.input}
              sx={{ flex: 1, mt: { xs: 2, sm: 0 } }}
            />
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
