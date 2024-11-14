import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import { memo, useCallback, useEffect, useMemo } from "react";
import * as Yup from "yup";

import { DialogLayoutProps } from "components/DialogLayout";
import FormLayout from "components/NewFormLayout";
import {
  NewInput as Input,
  NewSelect as Select
} from "components/shared";
import { DataAction, EmployeeType, Permission } from "constant/enums";
import { AN_ERROR_TRY_AGAIN, NS_COMMON, NS_COMPANY } from "constant/index";
import { EMAIL_REGEX } from "constant/regex";
import { useFormik } from "hooks/useFormik";
import { useAuth, useSnackbar } from "store/app/selectors";
import { InviteEmployeeData } from "store/company/actions";
import { useClientCompanies } from "store/company/selectors";
import { usePositionOptions } from "store/global/selectors";
import { getMessageErrorByAPI } from "utils/index";

type CommonProps = {
  typeEmployee: EmployeeType;
};

type AddNewProps = {
  type: DataAction.CREATE;
  initialValues: Omit<InviteEmployeeData, "roles" | "password" | "company"> & {
    permission: Permission;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: InviteEmployeeData) => Promise<any>;
} & CommonProps &
  Omit<DialogLayoutProps, "children" | "onSubmit">;

type UpdateProps = {
  type: DataAction.UPDATE;
  initialValues: Omit<InviteEmployeeData, "roles" | "password" | "company"> & {
    id: string;
    permission: Permission;
    roles: Permission[];
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (id: string, position: string, roles: Permission[]) => Promise<any>;
} & CommonProps &
  Omit<DialogLayoutProps, "children" | "onSubmit">;

type EmployeeCompanyFormProps = AddNewProps | UpdateProps;

const EmployeeCompanyForm = ({
  initialValues,
  typeEmployee,
  type,
  onSubmit: onSubmitProps,
  onClose,
  ...rest
}: EmployeeCompanyFormProps) => {
  const { onAddSnackbar } = useSnackbar();
  const { user, onGetProfile } = useAuth();
  const companyT = useTranslations(NS_COMPANY);
  const commonT = useTranslations(NS_COMMON);

  const { options, onGetOptions, isFetching, totalPages, pageIndex, pageSize } =
    usePositionOptions();

  const { items: clientCompanies, onGetClientCompanies } = useClientCompanies();
  useEffect(() => {
    onGetClientCompanies({});
  }, [onGetClientCompanies]);

  const label = useMemo(() => {
    switch (type) {
      case DataAction.CREATE:
        return commonT("createNew");
      case DataAction.UPDATE:
        return commonT("update");
      default:
        return "";
    }
  }, [commonT, type]);

  const onSubmit = useCallback(
    async (values) => {
      try {
        let newItem;
        if (type === DataAction.CREATE) {
          const { email, position, permission, client } =
            values as typeof initialValues;
          switch (typeEmployee) {
            case EmployeeType.EMPLOYEE:
              newItem = await onSubmitProps({
                email,
                position,
                roles: [permission],
                password: "123456",
                company: user?.company ?? "",
              });
              break;
            case EmployeeType.CLIENT:
              newItem = await onSubmitProps({
                email,
                position,
                roles: [Permission.CL],
                client,
                password: "123456",
                company: user?.company ?? "",
              });
              break;
            case EmployeeType.CONTRACTOR:
              newItem = await onSubmitProps({
                email,
                position,
                roles: [Permission.CT],
                client,
                password: "123456",
                company: user?.company ?? "",
              });
              break;
            default:
              newItem = undefined;
          }
        } else {
          const { id, position, roles } = values as typeof initialValues;
          newItem = await onSubmitProps(id, position, roles);
        }

        if (newItem) {
          onAddSnackbar(
            companyT("employees.notification.success", {
              label,
              typeEmployee: companyT(
                `employees.${
                  typeEmployee === EmployeeType.CLIENT
                    ? "client"
                    : typeEmployee === EmployeeType.CONTRACTOR
                    ? "contractor"
                    : "employee"
                }`,
              ).toLowerCase(),
            }),
            "success",
          );
          if (values?.email === user?.email) {
            onGetProfile();
          }
          onClose();
        } else {
          throw AN_ERROR_TRY_AGAIN;
        }
      } catch (error) {
        onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
      }
    },
    [
      commonT,
      companyT,
      label,
      onAddSnackbar,
      onClose,
      onGetProfile,
      onSubmitProps,
      type,
      typeEmployee,
      user?.company,
      user?.email,
    ],
  );

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit,
  });

  const onEndReached = () => {
    if (isFetching || (totalPages && pageIndex >= totalPages)) return;
    onGetOptions({ pageSize, pageIndex: pageIndex + 1 });
  };

  return (
    <FormLayout
      sx={{
        minWidth: { xs: "calc(100vw - 24px)", sm: 500 },
        maxWidth: { xs: "calc(100vw - 24px)", sm: 500 },
        minHeight: "auto",
      }}
      label={`${label} ${companyT("employees.key")}`}
      submitting={formik.isSubmitting}
      disabled={formik.isSubmitDisabled}
      onSubmit={formik.handleSubmit}
      onClose={onClose}
      {...rest}
    >
      <Stack spacing={2} py={3}>
        <Input
          title="Email"
          name="email"
          required
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values?.email}
          error={commonT(formik.touchedErrors.email, {
            name: "Email",
          })}
          disabled={type === DataAction.UPDATE}
          rootSx={sxConfig.input}
        />
        <Stack direction="row" spacing={2}>
          {typeEmployee === EmployeeType.EMPLOYEE ? (
            <Select
              title={commonT("permissionV")}
              name="permission"
              options={[
                { value: Permission.AM, label: "Admin" },
                { value: Permission.MN, label: "Manager" },
                { value: Permission.LE, label: "Leader" },
                { value: Permission.ST, label: "Staff" },
              ]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.permission}
              required
              fullWidth
              rootSx={sxConfig.input}
            />
          ) : (
            <Select
              title={companyT("clientCompany.title")}
              name="client"
              options={clientCompanies.map((c) => ({
                label: c.name,
                value: c.code,
              }))}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.client}
              fullWidth
              rootSx={sxConfig.input}
            />
          )}
          <Select
            options={options}
            title={commonT("position")}
            name="position"
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values?.position}
            error={commonT(formik.touchedErrors.position, {
              name: commonT("position"),
            })}
            fullWidth
            rootSx={sxConfig.input}
            onEndReached={onEndReached}
          />
        </Stack>
      </Stack>
    </FormLayout>
  );
};

export default memo(EmployeeCompanyForm);

export const validationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .required("form.error.required")
    .matches(EMAIL_REGEX, "form.error.invalid"),
  position: Yup.string().required("form.error.required"),
});

const sxConfig = {
  input: {
    height: 50,
  },
};
