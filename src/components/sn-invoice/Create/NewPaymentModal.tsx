import { Grid, Stack } from "@mui/material";
import FormLayout from "components/FormLayout";
import { Input } from "components/shared";
import { useFormik } from "formik";
import * as Yup from "yup";

function NewPaymentModal({ open, setOpen, handleChange }) {
  const formik = useFormik<{ payment_method: string }>({
    initialValues: {
      payment_method: "",
    },
    validationSchema: Yup.object().shape({
      payment_method: Yup.string().trim().required("Required"),
    }),
    onSubmit: (value) => {
      handleChange(value.payment_method);
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <FormLayout
      sx={{
        minWidth: { xs: "calc(100vw - 24px)", lg: 600 },
        maxWidth: { xs: "calc(100vw - 24px)", sm: 600 },
        minHeight: "auto",
      }}
      open={open}
      label="New Payment Method"
      submitText="Save"
      cancelText="Cancel"
      onClose={handleClose}
      onSubmit={formik.handleSubmit}
      disabled={Boolean(formik.errors.payment_method) || Boolean(!formik.dirty)}

      //   submitting={isFetching}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction={"row"} gap={2} pt={2} pb={6}>
            <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
              {/* <Typography color="#4D4D4D" fontSize="14px" fontWeight={700}>
              Payment method
            </Typography> */}
              <Input
                title="Payment method"
                name="payment_method"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values?.payment_method}
                error={formik.errors.payment_method}
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
                  border: "1px solid rgba(54, 153, 255, 0.5)",
                }}
                isSeparateError={true}
                onlyContent
              />
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </FormLayout>
  );
}

const sxConfig = {
  input: {
    height: 56,
  },
};

export default NewPaymentModal;
