import { useCallback } from "react";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";

import { NS_COMMON, NS_COMPANY } from "constant/index";
import { EmployeeType } from "constant/enums";
import { DialogLayoutProps } from "components/DialogLayout";
import FormLayout from "components/NewFormLayout";
import { NewSelect as Select, Text } from "components/shared";

type EmployeeTypeFormProps = {
  options: {
    label: string;
    value: EmployeeType;
  }[];
  onSubmit: (type: EmployeeType) => void;
} & Omit<DialogLayoutProps, "children" | "onSubmit">;

type FormDataType = {
  type: EmployeeType;
};

const initialValues: FormDataType = {
  type: EmployeeType.EMPLOYEE,
};

const EmployeeTypeForm = ({
  options,
  open,
  onClose,
  onSubmit: onSubmitProps,
}: EmployeeTypeFormProps) => {
  const companyT = useTranslations(NS_COMPANY);
  const commonT = useTranslations(NS_COMMON);
  const onSubmit = useCallback(
    (values: FormDataType) => {
      onSubmitProps(values.type);
    },
    [onSubmitProps],
  );

  const formik = useFormik({ initialValues, onSubmit });

  return (
    <FormLayout
      sx={{
        minWidth: { xs: "calc(100vw - 24px)", sm: 500 },
        maxWidth: { xs: "calc(100vw - 24px)", sm: 500 },
        minHeight: "auto",
      }}
      open={open}
      onClose={onClose}
      bottomProps={{
        sx: {
          pt: 3,
          pb: 5,
          px: 5,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
      submitting={formik.isSubmitting}
      onSubmit={formik.handleSubmit}
    >
      <Text
        pb={3}
        textAlign="center"
        color="#4D4D4D"
        fontSize={24}
        fontWeight={600}
      >
        {companyT("employees.form.addNewEmployee")}
      </Text>
      <Select
        name="type"
        title={companyT("employees.form.chooseCompanyType")}
        rootSx={{
          mx: 4,
        }}
        titleSx={{
          width: "100%",
          left: 0,
          pb: 2,
          textAlign: "center",
          color: "#4D4D4D",
          fontSize: 20,
          fontWeight: 600,
        }}
        options={options}
        value={formik.values.type}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
    </FormLayout>
  );
};

export default EmployeeTypeForm;
