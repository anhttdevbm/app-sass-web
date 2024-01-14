import { CheckBox } from "@mui/icons-material";
import { Grid, Stack, TextField } from "@mui/material";
import FormLayout from "components/FormLayout";
import { Input, Select } from "components/shared";
import Textarea from "components/sn-time-tracking/Component/Textarea";
import { NS_BILLING, NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { Controller } from "react-hook-form";

type Iprops = {
  open: boolean;
  handleClose: () => void;
};
const BillModal = (props: Iprops) => {
  const { handleClose, open } = props;
  const commonT = useTranslations(NS_COMMON);
  const billingT = useTranslations(NS_BILLING);
  return (
    <FormLayout
      sx={{
        minWidth: { xs: "calc(100vw - 24px)", lg: 600 },
        maxWidth: { xs: "calc(100vw - 24px)", sm: 600 },
        minHeight: "auto",
      }}
      open={open}
      label={billingT("detail.form.payment.title.editPayment")}
      submitText={billingT("detail.form.payment.button.updatePayment")}
      cancelText={commonT("form.cancel")}
      onClose={handleClose}
      //   onSubmit={handleSubmit(onSubmit)}
      //   submitting={isFetching}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction={"row"} gap={2} pt={2}>
            <Input
              title={billingT("detail.form.payment.title.amount")}
              name="description"
              // onChange={formik.handleChange}
              // onBlur={formik.handleBlur}
              // value={formik.values?.description}
              // error={commonT(touchedErrors?.description, {
              //   name: commonT("form.title.description"),
              // })}
              fullWidth
              rootSx={sxConfig.input}
              sx={{ flex: 1, mt: { xs: 2, sm: 0 } }}
            />
            <Input
              title={billingT("detail.form.payment.title.paidOn")}
              name="description"
              // onChange={formik.handleChange}
              // onBlur={formik.handleBlur}
              // value={formik.values?.description}
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
              name="description"
              // onChange={formik.handleChange}
              // onBlur={formik.handleBlur}
              // value={formik.values?.description}
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
