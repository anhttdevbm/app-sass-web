import { Checkbox, Grid, Stack, TextField } from "@mui/material";
import FormLayout from "components/FormLayout";
import { Input, Select, Text } from "components/shared";
import { NS_BILLING, NS_COMMON } from "constant/index";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { memo, useEffect } from "react";
import { Controller } from "react-hook-form";
import { Bill } from "store/billing/reducer";

type BillModalProps = {
  open?: boolean;
  handleClose?: () => void;
  isBillTo?: boolean;
  billTo: Bill;
  billFrom: Bill;
  setBillToInfo: (value: Bill) => void;
  setBillFromInfo: (value: Bill) => void;
};

const BillModal = (props: BillModalProps) => {
  const {
    handleClose,
    open,
    isBillTo,
    billFrom,
    billTo,
    setBillFromInfo,
    setBillToInfo,
  } = props;
  const commonT = useTranslations(NS_COMMON);
  const billingT = useTranslations(NS_BILLING);

  const formik = useFormik<Bill>({
    enableReinitialize: true,
    initialValues: {},
    onSubmit(values, formikHelpers) {
      if (isBillTo) {
        setBillToInfo({ ...values });
      } else {
        setBillFromInfo({ ...values });
      }
      formik.resetForm();
      handleClose?.();
    },
  });

  useEffect(() => {
    if (isBillTo) {
      formik.setValues(billTo);
    } else {
      formik.setValues(billFrom);
    }
  }, [billTo, billFrom, isBillTo]);
  return (
    <FormLayout
      sx={{
        minWidth: { xs: "calc(100vw - 24px)", lg: 500 },
        maxWidth: { xs: "calc(100vw - 24px)", sm: 500 },
        minHeight: "auto",
      }}
      open={open ?? false}
      label={
        isBillTo
          ? billingT("detail.form.invoice.bill.title.billTo")
          : billingT("detail.form.invoice.bill.title.billFrom")
      }
      //   submitText={billingT(`${salesFormTranslatePrefix}.button.export`)}
      cancelText={commonT("form.cancel")}
      onClose={() => handleClose?.() ?? null}
      onSubmit={formik.handleSubmit}
      //   submitting={isFetching}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction={"row"} gap={2}>
            <Input
              title={billingT("detail.form.invoice.bill.fullCompanyName")}
              name="fullNameCompany"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.fullNameCompany}
              // error={commonT(touchedErrors?.description, {
              //   name: commonT("form.title.description"),
              // })}
              fullWidth
              rootSx={sxConfig.input}
              sx={{ flex: 1, mt: { xs: 2, sm: 0 } }}
            />
            <Input
              title={billingT("detail.form.invoice.bill.taxID")}
              name="tax_id"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.tax_id}
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
          <Stack direction={"row"} gap={2}>
            <Input
              title={billingT("detail.form.invoice.bill.street")}
              name="street"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.street}
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
          <Stack direction={"row"} gap={2}>
            <Input
              title={billingT("detail.form.invoice.bill.city")}
              name="city"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.city}
              // error={commonT(touchedErrors?.description, {
              //   name: commonT("form.title.description"),
              // })}
              fullWidth
              rootSx={sxConfig.input}
              sx={{ flex: 1, mt: { xs: 2, sm: 0 } }}
            />
            <Input
              title={billingT("detail.form.invoice.bill.postcode")}
              name="zipCode"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.zipCode}
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
          <Stack direction={"row"} gap={2}>
            <Input
              title={billingT("detail.form.invoice.bill.state")}
              name="state"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.state}
              // error={commonT(touchedErrors?.description, {
              //   name: commonT("form.title.description"),
              // })}
              fullWidth
              rootSx={sxConfig.input}
              sx={{ flex: 1, mt: { xs: 2, sm: 0 } }}
            />
            <Input
              title={billingT("detail.form.invoice.bill.country")}
              name="country"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.country}
              // error={commonT(touchedErrors?.description, {
              //   name: commonT("form.title.description"),
              // })}
              fullWidth
              rootSx={sxConfig.input}
              sx={{ flex: 1, mt: { xs: 2, sm: 0 } }}
            />
          </Stack>
        </Grid>
        {isBillTo && (
          <Grid item xs={12}>
            <Stack direction={"row"} gap={2} alignItems={"center"} pb={2}>
              <Checkbox checked={formik.values?.save} />
              <Text variant={"body2"}>
                {billingT("detail.form.invoice.bill.save")}
              </Text>
            </Stack>
          </Grid>
        )}
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
